import { Component, OnInit, inject } from "@angular/core";
import { ReactiveFormsModule, Validators } from "@angular/forms";
import { User } from "../../models/user";
import { UserService } from "../../services/user.service";
import { AdminComponent } from "../../abstracts/admin-component/admin-component";
import { BaseCrudService } from "../../abstracts/base-crud-service";
import { MatDialog } from "@angular/material/dialog";
import { AdminDialogComponent } from "../../abstracts/admin-component/components/admin-dialog/admin-dialog.component";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from "@angular/common";
import { AdminTableComponent } from "../../abstracts/admin-component/components/admin-table/admin-table.component";
import { filter, switchMap } from "rxjs";
import { IconService } from "../../services/icon.service";

@Component({
  selector: "app-users",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    AdminTableComponent,
    IconService,
  ],
  providers: [
    {
      provide: BaseCrudService,
      useExisting: UserService,
    },
  ],
  templateUrl: "./users.component.html",
})
export class UsersComponent extends AdminComponent<User> implements OnInit {
  private dialog = inject(MatDialog);
  protected userService = inject(UserService);

  constructor() {
    super();
    this.config.set({
      title: "Users",
      itemsPerPage: 10,
      responseKey: "users",
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
    });
  }

  private formatRole(role: string): string {
    return role ? role.charAt(0).toUpperCase() + role.slice(1) : "";
  }

  private formatStatus(isActive: boolean): string {
    const status = isActive ? "Active" : "Inactive";
    const statusClass = isActive
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";

    return `<span class="text-xs font-medium px-2.5 py-0.5 rounded ${statusClass}">${status}</span>`;
  }

  protected deleteItem(user: User): void {
    if (!user?.id) return;

    this.dialogService
      .confirm(
        "Delete User",
        `Are you sure you want to delete ${user.fullName}?`
      )
      .pipe(
        filter((result) => result?.confirmed === true),
        switchMap(() => this.userService.delete(user.id))
      )
      .subscribe({
        next: () => this.loadData(),
        error: (err) => {
          this.dialogService.error("Delete failed", err.message);
          console.error("Delete failed", err);
        },
      });
  }

  protected openAddDialog(): void {
    this.openDialog();
  }

  protected openEditDialog(user: User): void {
    this.openDialog(user);
  }

  private openDialog(user?: User): void {
    const dialogRef = this.dialog.open(AdminDialogComponent, {
      width: "800px",
      disableClose: true,
      data: {
        model: user,
        modelName: "User",
        modelConstructor: User,
        formFields: [
          {
            key: "email",
            label: "Email",
            type: "email",
            required: true,
            placeholder: "Enter email address",
            validators: [Validators.email],
          },
          {
            key: "fullName",
            label: "Full Name",
            type: "text",
            required: true,
            placeholder: "Enter full name",
            validators: [Validators.minLength(2), Validators.maxLength(100)],
          },
          {
            key: "password",
            label: "Password",
            type: "password",
            required: true,
            placeholder: "Enter password",
            validators: [Validators.minLength(8), Validators.maxLength(100)],
          },
          {
            key: "role",
            label: "Role",
            type: "select",
            required: true,
            options: [
              { value: "student", label: "Student" },
              { value: "supervisor", label: "Supervisor" },
              { value: "teacher", label: "Teacher" },
              { value: "superuser", label: "Superuser" },
            ],
          },
          {
            key: "isActive",
            label: "Active",
            type: "boolean",
          },
        ],
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadData();
      }
    });
  }
}
