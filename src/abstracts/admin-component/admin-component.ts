// admin-component.ts
import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  signal,
  computed,
  DestroyRef,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, FormGroup } from "@angular/forms";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { catchError, EMPTY } from "rxjs";
import { BaseCrudService } from "@/abstracts/base-crud-service";
import { BaseCrudModel } from "@/abstracts/base-crud-model";
import { DialogService } from "@/services/dialog.service";

export type FilterType = "text" | "select" | "date" | "boolean" | "number";
export type SortDirection = "asc" | "desc" | null;

export interface TableColumn<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  type?: "text" | "boolean" | "date" | "custom" | "number";
  filterType?: FilterType;
  filterOptions?: Array<{ value: any; label: string }>;
  customTemplate?: (value: any, item: T) => string;
  width?: string;
  filterFalseLabel?: string;
  filterTrueLabel?: string;
}

export interface ColumnFilter {
  field: string;
  value: any;
  type: FilterType;
}

export interface ColumnSort {
  field: string;
  direction: SortDirection;
}

export interface AdminComponentConfig<T> {
  title: string;
  columns: TableColumn<T>[];
  defaultSort?: ColumnSort;
  itemsPerPage?: number;
  responseKey?: string;
}

@Component({
  selector: "app-admin",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: "",
})
export abstract class AdminComponent<T extends BaseCrudModel<T, any>>
  implements OnInit, OnDestroy
{
  config = signal<AdminComponentConfig<T>>({
    title: "",
    columns: [],
    itemsPerPage: 10,
    responseKey: "items",
  });

  // Injected services
  protected service = inject(BaseCrudService<T>);
  protected dialogService = inject(DialogService);
  protected destroyRef = inject(DestroyRef);

  // Signals
  protected items = signal<T[]>([]);
  protected columnFilters = signal<Map<string, ColumnFilter>>(new Map());
  protected columnSorts = signal<Map<string, ColumnSort>>(new Map());
  protected currentPage = signal(1);
  protected showModal = signal(false);
  protected editingItem = signal<T | null>(null);
  protected formErrors = signal<string[]>([]);
  protected showFilters = signal(false);

  // Computed values
  protected sortableColumns = computed(() =>
    this.config().columns.filter((col) => col.sortable !== false)
  );

  protected filterableColumns = computed(() =>
    this.config().columns.filter((col) => col.filterable !== false)
  );

  protected itemsPerPage = computed(() => this.config().itemsPerPage || 10);

  protected hasActiveFilters = computed(() => {
    return this.columnFilters().size > 0;
  });

  protected hasActiveSorts = computed(() => {
    return Array.from(this.columnSorts().values()).some(
      (sort) => sort.direction !== null
    );
  });

  protected totalPages = computed(() => {
    const filtered = this.filteredItems();
    const length = Array.isArray(filtered) ? filtered.length : 0;
    return Math.ceil(length / this.itemsPerPage());
  });

  protected paginatedItems = computed(() => {
    const filtered = this.filteredItems();
    if (!Array.isArray(filtered)) {
      return [];
    }
    const start = (this.currentPage() - 1) * this.itemsPerPage();
    const end = start + this.itemsPerPage();
    return filtered.slice(start, end);
  });

  ngOnInit(): void {
    this.initializeDefaultSort();
    this.loadData();
  }

  ngOnDestroy(): void {
    // No need to manually handle destruction with takeUntilDestroyed
  }

  protected initializeDefaultSort(): void {
    const defaultSort = this.config().defaultSort;
    if (defaultSort) {
      const sorts = new Map(this.columnSorts());
      sorts.set(defaultSort.field, defaultSort);
      this.columnSorts.set(sorts);
    }
  }

  protected loadData(): void {
    this.service
      .load()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((error) => {
          console.error("Error loading data:", error);
          return EMPTY;
        })
      )
      .subscribe((response: any) => {
        const data = response[this.config().responseKey || "items"] || [];
        this.items.set(data);
      });
  }

  protected filteredItems = computed(() => {
    let result = this.items();

    this.columnFilters().forEach((filter) => {
      if (
        filter.value === null ||
        filter.value === undefined ||
        filter.value === ""
      ) {
        return;
      }

      result = result.filter((item) => {
        const value = this.getNestedValue(item, filter.field);
        switch (filter.type) {
          case "text":
            return String(value)
              .toLowerCase()
              .includes(filter.value.toLowerCase());
          case "boolean":
            // Ensure value is boolean
            const filterValue =
              filter.value === true || filter.value === "true";
            return value === filterValue;
          case "select":
            return value === filter.value;
          default:
            return true;
        }
      });
    });

    // Sorting
    const sorts = Array.from(this.columnSorts().values()).filter(
      (s) => s.direction
    );
    if (sorts.length > 0) {
      result = [...result].sort((a, b) => {
        const sortField = sorts[0].field;
        const aVal = this.getNestedValue(a, sortField);
        const bVal = this.getNestedValue(b, sortField);

        if (aVal > bVal) return sorts[0].direction === "asc" ? 1 : -1;
        if (aVal < bVal) return sorts[0].direction === "asc" ? -1 : 1;
        return 0;
      });
    }

    return result;
  });

  // Add this method for nested property access
  protected getNestedValue(item: any, path: string): any {
    return path.split(".").reduce((acc, key) => acc?.[key], item);
  }
  protected getColumns(): TableColumn<T>[] {
    return this.config().columns;
  }
  protected setPage(page: number): void {
    this.currentPage.set(page);
  }

  protected onColumnSort({
    field,
    direction,
  }: {
    field: string;
    direction: "asc" | "desc";
  }): void {
    const currentSorts = new Map(this.columnSorts());

    if (currentSorts.has(field)) {
      const currentSort = currentSorts.get(field)!;
      if (currentSort.direction === direction) {
        currentSorts.delete(field);
      } else {
        currentSorts.set(field, { field, direction });
      }
    } else {
      currentSorts.set(field, { field, direction });
    }

    this.columnSorts.set(currentSorts);
    this.currentPage.set(1);
  }
  updateFilter({ field, value }: { field: string; value: any }): void {
    const currentFilters = new Map(this.columnFilters());

    if (value !== null && value !== undefined && value !== "") {
      const column = this.config().columns.find((c) => c.key === field);
      currentFilters.set(field, {
        field,
        value,
        type: column?.filterType as FilterType,
      });
    } else {
      currentFilters.delete(field);
    }

    this.columnFilters.set(currentFilters);
    this.currentPage.set(1);
  }
}
