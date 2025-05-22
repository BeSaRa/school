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

export interface TableColumn<T = any> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  type?: "text" | "boolean" | "date" | "custom";
  customTemplate?: (value: any, item: T) => string;
}

export interface AdminComponentConfig<T> {
  title: string;
  columns: TableColumn<T>[];
  searchFields?: (keyof T)[];
  defaultSort?: keyof T;
  itemsPerPage?: number;
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
    searchFields: [],
    defaultSort: "" as keyof T,
    itemsPerPage: 10,
  });

  protected service: BaseCrudService<T> = inject(BaseCrudService);
  protected dialogService = inject(DialogService);
  protected fb = inject(FormBuilder);

  // Signals
  protected items = signal<T[]>([]);
  protected searchTerm = signal("");
  protected sortField = signal<keyof T | "">("");
  protected sortDirection = signal<"asc" | "desc">("asc");
  protected currentPage = signal(1);
  protected showModal = signal(false);
  protected editingItem = signal<T | null>(null);
  protected formErrors = signal<string[]>([]);

  // Form
  public itemForm: FormGroup = this.fb.group({});

  // Computed values
  protected sortableColumns = computed(() =>
    this.config().columns.filter((col) => col.sortable !== false)
  );

  protected itemsPerPage = computed(() => this.config().itemsPerPage || 10);

  protected filteredItems = computed(() => {
    // Ensure we always have an array, even if items() returns null or undefined
    let filtered = this.items() || [];
    const search = this.searchTerm().toLowerCase();

    if (search && this.config().searchFields) {
      filtered = filtered.filter((item) =>
        this.config().searchFields!.some((field) => {
          const value = item[field];
          return value?.toString().toLowerCase().includes(search);
        })
      );
    }

    // Sort
    const sortField = this.sortField();
    if (sortField && Array.isArray(filtered) && filtered.length > 0) {
      const direction = this.sortDirection();
      try {
        // Create a new array to avoid modifying the original
        filtered = [...filtered].sort((a, b) => {
          if (!a || !b) return 0;
          const aVal = a[sortField];
          const bVal = b[sortField];

          if (aVal < bVal) return direction === "asc" ? -1 : 1;
          if (aVal > bVal) return direction === "asc" ? 1 : -1;
          return 0;
        });
      } catch (error) {
        console.error("Error sorting items:", error);
        // Return the unsorted array if sorting fails
        return filtered;
      }
    }

    return filtered;
  });

  protected totalPages = computed(() => {
    const filtered = this.filteredItems();
    // Ensure we're checking if filtered is an array and has a length
    const length = Array.isArray(filtered) ? filtered.length : 0;
    return Math.ceil(length / this.itemsPerPage());
  });

  protected paginatedItems = computed(() => {
    const filtered = this.filteredItems();
    // Add explicit check to ensure filtered is an array
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

  ngOnInit(): void {
    this.initializeSort();
    this.loadData();
    this.initializeForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeSort(): void {
    const defaultSort = this.config().defaultSort;
    if (defaultSort) {
      this.sortField.set(defaultSort);
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
        console.log(response);
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

  protected getMin(a: number, b: number): number {
    return a < b ? a : b;
  }

  // Abstract methods to be implemented by child components
  protected initializeForm(): void {
    // Default empty implementation
    this.itemForm = this.fb.group({});
  }

  protected getFormData(): Partial<T> {
    // Default implementation returns empty object
    return {};
  }

  protected populateForm(item: T): void {
    // Default empty implementation
  }

  protected getItemId(item: T): any {
    // Default implementation tries to get id property
    return (item as any).id;
  }

  // Event handlers
  protected onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
    this.setPage(1);
  }

  protected onSortChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.sortField.set(target.value as keyof T);
  }

  protected toggleSortDirection(): void {
    this.sortDirection.set(this.sortDirection() === "asc" ? "desc" : "asc");
  }

  protected setPage(page: number): void {
    this.currentPage.set(page);
  }

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

  protected formatCellValue(
    value: any,
    column: TableColumn<T>,
    item: T
  ): string {
    if (column.customTemplate) {
      return column.customTemplate(value, item);
    }

    switch (column.type) {
      case "boolean":
        return value ? "Yes" : "No";
      case "date":
        return value ? new Date(value).toLocaleDateString() : "";
      default:
        return value?.toString() || "";
    }
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
    // Convert camelCase to Title Case
    return fieldName
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  }
}
