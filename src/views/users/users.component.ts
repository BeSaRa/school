import { Component } from "@angular/core";
import { FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { User } from "@/models/user";
import { UserService } from "@/services/user.service";
import {
  AdminComponent,
  FilterType,
  TableColumn,
} from "@/abstracts/admin-component/admin-component";
import { BaseCrudService } from "@/abstracts/base-crud-service";
import { AdminTableComponent } from "@/abstracts/admin-component/components/admin-table/admin-table.component";

@Component({
  selector: "app-users",
  standalone: true,
  imports: [AdminTableComponent, ReactiveFormsModule],
  providers: [
    {
      provide: BaseCrudService,
      useExisting: UserService,
    },
  ],
  templateUrl: "./users.component.html",
})
export class UsersComponent extends AdminComponent<User> {
  protected itemForm!: FormGroup;

  override ngOnInit(): void {
    this.config.set({
      title: "Users",
      itemsPerPage: 10,
      columns: [
        {
          key: "email",
          label: "Email",
          sortable: true,
          filterable: true,
          type: "text",
          filterType: "text",
        },
        {
          key: "fullName",
          label: "Full Name",
          sortable: true,
          filterable: true,
          type: "text",
          filterType: "text",
        },
        {
          key: "role",
          label: "Role",
          sortable: true,
          filterable: true,
          type: "custom",
          filterType: "select",
          filterOptions: [
            { value: "student", label: "Student" },
            { value: "supervisor", label: "Supervisor" },
            { value: "teacher", label: "Teacher" },
            { value: "superuser", label: "Superuser" },
          ],
          customTemplate: (value: string) => this.formatRole(value),
        },
        {
          key: "isActive",
          label: "Status",
          sortable: true,
          filterable: true,
          type: "boolean",
          filterType: "boolean",
          filterTrueLabel: "Active",
          filterFalseLabel: "Inactive",
          customTemplate: (value: boolean) => this.formatStatus(value),
        },
      ],
      responseKey: "users",
    });
    super.ngOnInit();
  }

  protected initializeForm(): void {
    this.itemForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      fullName: [
        "",
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100),
        ],
      ],
      role: ["", [Validators.required]],
      isActive: [true],
    });
  }

  protected getFormData(): Partial<User> {
    return {
      email: this.itemForm.get("email")?.value,
      fullName: this.itemForm.get("fullName")?.value,
      role: this.itemForm.get("role")?.value,
      isActive: this.itemForm.get("isActive")?.value,
    };
  }

  protected populateForm(user: User): void {
    this.itemForm.patchValue({
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      isActive: user.isActive,
    });
  }

  protected getColumns(): TableColumn<User>[] {
    return this.config().columns;
  }

  setPage(page: number): void {
    this.currentPage.set(page);
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

  onColumnSort({
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

  private formatRole(role: string): string {
    return `<span class="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">${role}</span>`;
  }

  private formatStatus(isActive: boolean): string {
    return isActive
      ? `<span class="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">Active</span>`
      : `<span class="bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">Inactive</span>`;
  }
}
