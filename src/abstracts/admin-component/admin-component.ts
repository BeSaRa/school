import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  Input,
  signal,
  computed,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, FormGroup } from "@angular/forms";
import { Subject, takeUntil, catchError, EMPTY } from "rxjs";
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
  enableGlobalSearch?: boolean;
  globalSearchFields?: string[];
}

@Component({
  selector: "app-admin",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./admin-component.html",
})
export class AdminComponent<T extends BaseCrudModel<T, any>>
  implements OnInit, OnDestroy
{
  @Input({ required: true }) config = signal<AdminComponentConfig<T>>({
    title: "",
    columns: [],
    itemsPerPage: 10,
    enableGlobalSearch: false,
    globalSearchFields: [],
  });

  protected service: BaseCrudService<T> = inject(BaseCrudService);
  protected dialogService = inject(DialogService);
  protected fb = inject(FormBuilder);

  // Signals
  protected items = signal<T[]>([]);
  protected globalSearchTerm = signal("");
  protected columnFilters = signal<Map<string, ColumnFilter>>(new Map());
  protected columnSorts = signal<Map<string, ColumnSort>>(new Map());
  protected currentPage = signal(1);
  protected showModal = signal(false);
  protected editingItem = signal<T | null>(null);
  protected formErrors = signal<string[]>([]);
  protected showFilters = signal(false);

  // Form
  public itemForm: FormGroup = this.fb.group({});

  // Computed values
  protected sortableColumns = computed(() =>
    this.config().columns.filter((col) => col.sortable !== false)
  );

  protected filterableColumns = computed(() =>
    this.config().columns.filter((col) => col.filterable !== false)
  );

  protected itemsPerPage = computed(() => this.config().itemsPerPage || 10);

  protected hasActiveFilters = computed(() => {
    return (
      this.columnFilters().size > 0 ||
      (this.config().enableGlobalSearch && this.globalSearchTerm().length > 0)
    );
  });

  protected hasActiveSorts = computed(() => {
    return Array.from(this.columnSorts().values()).some(
      (sort) => sort.direction !== null
    );
  });

  protected filteredItems = computed(() => {
    let filtered = [...this.items()];

    // Apply global search if enabled
    if (this.config().enableGlobalSearch && this.globalSearchTerm()) {
      const searchTerm = this.globalSearchTerm().toLowerCase();
      const searchFields = this.config().globalSearchFields || [];

      filtered = filtered.filter((item) => {
        return searchFields.some((field) => {
          const value = this.getNestedValue(item, field);
          return value?.toString().toLowerCase().includes(searchTerm);
        });
      });
    }

    // Apply column filters
    for (const [fieldKey, filter] of this.columnFilters()) {
      filtered = this.applyColumnFilter(filtered, filter);
    }

    // Apply sorting
    const activeSorts = Array.from(this.columnSorts().values())
      .filter((sort) => sort.direction !== null)
      .sort((a, b) => {
        // Maintain sort order - first applied sorts take precedence
        const aIndex = Array.from(this.columnSorts().keys()).indexOf(a.field);
        const bIndex = Array.from(this.columnSorts().keys()).indexOf(b.field);
        return aIndex - bIndex;
      });

    if (activeSorts.length > 0) {
      filtered = filtered.sort((a, b) => {
        for (const sort of activeSorts) {
          const aVal = this.getNestedValue(a, sort.field);
          const bVal = this.getNestedValue(b, sort.field);

          const comparison = this.compareValues(aVal, bVal);
          if (comparison !== 0) {
            return sort.direction === "asc" ? comparison : -comparison;
          }
        }
        return 0;
      });
    }

    return filtered;
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

  protected visiblePages = computed(() => {
    const current = this.currentPage();
    const total = this.totalPages();
    const pages: number[] = [];

    const start = Math.max(1, current - 2);
    const end = Math.min(total, current + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  });

  private destroy$ = new Subject<void>();

  get activeSortCount(): number {
    return Array.from(this.columnSorts().values()).filter(
      (s) => s.direction !== null
    ).length;
  }

  ngOnInit(): void {
    this.initializeDefaultSort();
    this.loadData();
    this.initializeForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeDefaultSort(): void {
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
        takeUntil(this.destroy$),
        catchError((error) => {
          this.dialogService.error("Error loading data", error).subscribe();
          return EMPTY;
        })
      )
      .subscribe((response: any) => {
        let items: T[] = [];
        if (response && typeof response === "object") {
          const arrayProps = Object.keys(response).filter(
            (key) =>
              Array.isArray(response[key]) &&
              key !== "$$__service_name__$$" &&
              key !== "count"
          );
          if (arrayProps.length > 0) {
            items = response[arrayProps[0]];
          } else if (Array.isArray(response)) {
            items = response;
          }
        }

        this.items.set(items);
      });
  }

  private applyColumnFilter(items: T[], filter: ColumnFilter): T[] {
    if (!filter.value || filter.value === "") {
      return items;
    }

    return items.filter((item) => {
      const fieldValue = this.getNestedValue(item, filter.field);

      switch (filter.type) {
        case "text":
          return fieldValue
            ?.toString()
            .toLowerCase()
            .includes(filter.value.toLowerCase());
        case "select":
          return fieldValue === filter.value;
        case "boolean":
          return fieldValue === (filter.value === "true");
        case "number":
          return fieldValue === Number(filter.value);
        case "date":
          // Simple date comparison - you might want to enhance this
          const itemDate = new Date(fieldValue).toDateString();
          const filterDate = new Date(filter.value).toDateString();
          return itemDate === filterDate;
        default:
          return fieldValue
            ?.toString()
            .toLowerCase()
            .includes(filter.value.toLowerCase());
      }
    });
  }

  private compareValues(a: any, b: any): number {
    if (a == null && b == null) return 0;
    if (a == null) return -1;
    if (b == null) return 1;

    // Handle dates
    if (a instanceof Date && b instanceof Date) {
      return a.getTime() - b.getTime();
    }

    // Handle numbers
    if (typeof a === "number" && typeof b === "number") {
      return a - b;
    }

    // Handle strings (default)
    const aStr = a.toString().toLowerCase();
    const bStr = b.toString().toLowerCase();
    return aStr.localeCompare(bStr);
  }

  protected getNestedValue(item: any, path: string): any {
    return path.split(".").reduce((acc, key) => {
      return acc && acc[key] !== undefined ? acc[key] : undefined;
    }, item);
  }

  protected getMin(a: number, b: number): number {
    return a < b ? a : b;
  }

  // Filter methods
  protected onColumnFilter(column: TableColumn<T>, value: any): void {
    console.log(column, value);

    const filters = new Map(this.columnFilters());

    if (!value || value === "") {
      filters.delete(column.key);
    } else {
      const filterType =
        column.filterType || this.getDefaultFilterType(column.type);
      filters.set(column.key, {
        field: column.key,
        value: value,
        type: filterType,
      });
    }

    this.columnFilters.set(filters);
    this.setPage(1); // Reset to first page when filtering
  }

  protected getColumnFilterValue(columnKey: string): any {
    return this.columnFilters().get(columnKey)?.value || "";
  }

  protected clearColumnFilter(columnKey: string): void {
    const filters = new Map(this.columnFilters());
    filters.delete(columnKey);
    this.columnFilters.set(filters);
  }

  protected clearAllFilters(): void {
    this.columnFilters.set(new Map());
    this.globalSearchTerm.set("");
    this.setPage(1);
  }

  // Sort methods
  protected onColumnSort(column: TableColumn<T>): void {
    if (!column.sortable) return;

    const sorts = new Map(this.columnSorts());
    const currentSort = sorts.get(column.key);

    let newDirection: SortDirection;
    if (!currentSort || currentSort.direction === null) {
      newDirection = "asc";
    } else if (currentSort.direction === "asc") {
      newDirection = "desc";
    } else {
      newDirection = null;
    }

    if (newDirection === null) {
      sorts.delete(column.key);
    } else {
      sorts.set(column.key, {
        field: column.key,
        direction: newDirection,
      });
    }

    this.columnSorts.set(sorts);
  }

  protected getColumnSortDirection(columnKey: string): SortDirection {
    return this.columnSorts().get(columnKey)?.direction || null;
  }

  protected getSortIcon(columnKey: string): string {
    const direction = this.getColumnSortDirection(columnKey);
    switch (direction) {
      case "asc":
        return "↑";
      case "desc":
        return "↓";
      default:
        return "↕";
    }
  }

  protected clearAllSorts(): void {
    this.columnSorts.set(new Map());
  }

  getDefaultFilterType(columnType?: string): FilterType {
    switch (columnType) {
      case "boolean":
        return "boolean";
      case "date":
        return "date";
      case "number":
        return "number";
      default:
        return "text";
    }
  }

  // Global search methods
  protected onGlobalSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.globalSearchTerm.set(target.value);
    this.setPage(1);
  }

  protected toggleFilters(): void {
    this.showFilters.set(!this.showFilters());
  }

  // Pagination
  protected setPage(page: number): void {
    this.currentPage.set(page);
  }

  // Modal and CRUD operations
  protected openCreateModal(): void {
    this.editingItem.set(null);
    this.itemForm.reset();
    this.formErrors.set([]);
    this.showModal.set(true);
  }

  protected openEditModal(item: T): void {
    this.editingItem.set(item);
    this.populateForm(item);
    this.formErrors.set([]);
    this.showModal.set(true);
  }

  protected closeModal(): void {
    this.showModal.set(false);
    this.editingItem.set(null);
    this.itemForm.reset();
    this.formErrors.set([]);
  }

  protected onSubmit(): void {
    if (this.itemForm.invalid) {
      this.setFormErrors();
      return;
    }

    const formData = this.getFormData();
    const editingItem = this.editingItem();

    const operation$ = editingItem
      ? this.service.update({ ...editingItem, ...formData } as T)
      : this.service.create(formData as T);

    operation$
      .pipe(
        takeUntil(this.destroy$),
        catchError((error) => {
          this.dialogService
            .error(`Error ${editingItem ? "updating" : "creating"} item`, error)
            .subscribe();
          return EMPTY;
        })
      )
      .subscribe(() => {
        this.closeModal();
        this.loadData();
      });
  }

  protected deleteItem(item: T): void {
    this.dialogService
      .confirm(
        "Delete Item",
        "Are you sure you want to delete this item? This action cannot be undone."
      )
      .subscribe((confirmed) => {
        if (confirmed) {
          this.service
            .delete(this.getItemId(item))
            .pipe(
              takeUntil(this.destroy$),
              catchError((error) => {
                this.dialogService
                  .error("Error deleting item", error)
                  .subscribe();
                return EMPTY;
              })
            )
            .subscribe(() => {
              this.loadData();
            });
        }
      });
  }

  // Cell formatting
  protected getCellValue(item: T, field: string): any {
    return this.getNestedValue(item, field);
  }

  protected formatCellValue(
    value: any,
    column: TableColumn<T>,
    item: T
  ): string {
    if (column.customTemplate) {
      return column.customTemplate(value, item);
    }

    const actualValue = this.getNestedValue(item, column.key);

    switch (column.type) {
      case "boolean":
        return actualValue
          ? column.filterTrueLabel || "Yes"
          : column.filterFalseLabel || "No";
      case "date":
        return actualValue ? new Date(actualValue).toLocaleDateString() : "";
      case "number":
        return actualValue?.toLocaleString() || "";
      default:
        return actualValue?.toString() || "";
    }
  }

  // Abstract methods to be implemented by child components
  protected initializeForm(): void {
    this.itemForm = this.fb.group({});
  }

  protected getFormData(): Partial<T> {
    return {};
  }

  protected populateForm(item: T): void {
    // Default empty implementation
  }

  protected getItemId(item: T): any {
    return (item as any).id;
  }

  private setFormErrors(): void {
    const errors: string[] = [];

    Object.keys(this.itemForm.controls).forEach((key) => {
      const control = this.itemForm.get(key);
      if (control?.errors) {
        if (control.errors["required"]) {
          errors.push(`${this.getFieldLabel(key)} is required`);
        }
        if (control.errors["email"]) {
          errors.push(`${this.getFieldLabel(key)} must be a valid email`);
        }
        if (control.errors["minlength"]) {
          errors.push(
            `${this.getFieldLabel(key)} must be at least ${control.errors["minlength"].requiredLength} characters`
          );
        }
        if (control.errors["maxlength"]) {
          errors.push(
            `${this.getFieldLabel(key)} must be no more than ${control.errors["maxlength"].requiredLength} characters`
          );
        }
      }
    });

    this.formErrors.set(errors);
  }

  private getFieldLabel(fieldName: string): string {
    return fieldName
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  }
}
