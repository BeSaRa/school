// admin-table.component.ts
import {
  Component,
  Input,
  Output,
  EventEmitter,
  inject,
  signal,
  computed,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { ColumnFilter } from "../../admin-component";

export interface TableColumn<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  type?: "text" | "boolean" | "date" | "custom" | "number";
  filterType?: "text" | "select" | "date" | "boolean" | "number";
  filterOptions?: Array<{ value: any; label: string }>;
  customTemplate?: (value: any, item: T) => string;
  width?: string;
  filterFalseLabel?: string;
  filterTrueLabel?: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
}

@Component({
  selector: "app-admin-table",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./admin-table.component.html",
})
export class AdminTableComponent<T> {
  @Input() data: T[] = [];
  @Input() columns: TableColumn<T>[] = [];
  @Input() pagination: PaginationInfo = {
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 10,
  };
  @Input() searchableFields: string[] = [];
  @Output() pageChange = new EventEmitter<number>();
  @Output() sortChange = new EventEmitter<{
    field: string;
    direction: "asc" | "desc";
  }>();

  @Input() hasColumnFilters: boolean = false;
  @Input() columnFilters: Map<string, ColumnFilter> = new Map();
  protected searchTerm = signal<string>("");
  @Output() filterChange = new EventEmitter<{ field: string; value: any }>();

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
  protected get hasActiveFilters(): boolean {
    return this.searchTerm().length > 0;
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
    const current = this.pagination.currentPage;
    const total = this.pagination.totalPages;
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
