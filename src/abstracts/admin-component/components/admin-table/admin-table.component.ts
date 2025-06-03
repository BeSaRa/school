import {
  Component,
  input,
  output,
  computed,
  signal,
  ContentChild,
  TemplateRef,
  inject,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { ColumnFilter } from "../../admin-component";
import { IconService } from "../../../../services/icon.service";
import { LocalService } from "@/services/local.service";
import { LangKeysContract } from "@/types/localization.types";

export type FilterType =
  | "text"
  | "select"
  | "date"
  | "boolean"
  | "number"
  | "custom";

export interface TableColumn<T = any> {
  key: string;
  label: keyof LangKeysContract;
  sortable?: boolean;
  filterable?: boolean;
  type?: FilterType;
  filterType?: FilterType;
  filterOptions?: Array<{ value: any; label: keyof LangKeysContract }>;
  customTemplate?: (value: any, item: T) => string;
  width?: string;
  filterFalseLabel?: keyof LangKeysContract;
  filterTrueLabel?: keyof LangKeysContract;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
}

@Component({
  selector: "app-admin-table",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IconService],
  templateUrl: "./admin-table.component.html",
})
export class AdminTableComponent<T> {
  localService = inject(LocalService);
  // Inputs using new input() syntax
  data = input<T[]>([]);
  columns = input<TableColumn<T>[]>([]);
  pagination = input<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 10,
  });
  searchableFields = input<string[]>([]);
  hasColumnFilters = input<boolean>(false);
  columnFilters = input<Map<string, ColumnFilter>>(new Map());

  @ContentChild("actions", { read: TemplateRef })
  actionsTemplate!: TemplateRef<any>;

  // Outputs using new output() syntax
  pageChange = output<number>();
  sortChange = output<{ field: string; direction: "asc" | "desc" }>();
  filterChange = output<{ field: string; value: any }>();

  // Local state
  protected searchTerm = signal<string>("");

  // Computed values
  protected hasActiveFilters = computed(() => this.searchTerm().length > 0);

  protected onFilterChange(event: Event, column: TableColumn<T>): void {
    let value: any = null;
    if (event.target instanceof HTMLInputElement) {
      value = event.target.value;
    } else if (event.target instanceof HTMLSelectElement) {
      if (column.filterType === "boolean") {
        if (event.target.value === "") {
          value = null; // Explicitly set to null when "All" is selected
        } else {
          value = event.target.value === "true";
        }
      } else {
        value = event.target.value;
        if (event.target.value === "") {
          value = null;
        }
      }
    }
    this.filterChange.emit({ field: column.key, value });
  }

  protected onPageChange(page: number): void {
    this.pageChange.emit(page);
  }

  protected onSortChange(field: string, direction: "asc" | "desc"): void {
    this.sortChange.emit({ field, direction });
  }

  protected formatCellValue(
    value: any,
    column: TableColumn<T>,
    item: T
  ): string {
    if (column.customTemplate) {
      return column.customTemplate(value, item);
    }
    return value?.toString() || "";
  }

  protected getNestedValue(item: any, path: string): any {
    return path.split(".").reduce((acc, key) => {
      return acc && acc[key] !== undefined ? acc[key] : undefined;
    }, item);
  }

  protected getVisiblePages(): number[] {
    const current = this.pagination().currentPage;
    const total = this.pagination().totalPages;
    const pages: number[] = [];
    const start = Math.max(1, current - 2);
    const end = Math.min(total, current + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  protected getMin(a: number, b: number): number {
    return a < b ? a : b;
  }
}
