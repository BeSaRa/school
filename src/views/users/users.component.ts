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
import { LangKeysContract } from "@/types/localization.types";
import { LookupService } from "@/services/lookup.service";

@Component({
  selector: "app-users",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatIconModule, AdminTableComponent],
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
  protected lookupService = inject(LookupService);

  constructor() {
    super();
    this.config.set({
      itemsPerPage: 20,
      responseKey: "users",
      columns: [
        {
          key: "email",
          label: "column_email",
          sortable: true,
          filterable: true,
          type: "text",
          filterType: "text",
        },
        {
          key: "fullName",
          label: "column_full_name",
          sortable: true,
          filterable: true,
          type: "text",
          filterType: "text",
        },
        {
          key: "role",
          label: "column_role",
          sortable: true,
          filterable: true,
          type: "custom",
          filterType: "select",
          filterOptions: this.lookupService.lookups.role,
          customTemplate: (value: string) => this.formatRole(`role_${value}` as keyof LangKeysContract),
        },
        {
          key: "isActive",
          label: "column_status",
          sortable: true,
          filterable: true,
          type: "boolean",
          filterType: "boolean",
          filterTrueLabel: "status_active",
          filterFalseLabel: "status_inactive",
          customTemplate: (value: boolean) => this.formatStatus(value),
        },
      ],
    });
  }

  private formatRole(label: keyof LangKeysContract): string {
    return label ? this.localService.locals()[label] : "";
  }

  private formatStatus(isActive: boolean): string {
    const status = isActive ? this.localService.locals().status_active : this.localService.locals().status_inactive;
    const statusClass = isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";

    return `<span class="text-xs font-medium px-2.5 py-0.5 rounded ${statusClass}">${status}</span>`;
  }

  protected deleteUser(user: User): void {
    if (!user?.id) return;

    this.dialogService
      .confirm(this.localService.locals().delete_user, this.localService.locals().delete_user_question, this.localService.locals().delete, this.localService.locals().cancel)
      .pipe(
        filter((result) => result?.confirmed === true),
        switchMap(() => this.userService.delete(user.id))
      )
      .subscribe({
        next: () => this.loadData(),
        error: (err) => {
          this.dialogService.error(this.localService.locals().error_deleting_user, err.message).subscribe();
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
        modelName: this.localService.locals().user,
        modelConstructor: User,
        formFields: [
          {
            key: "email",
            label: this.localService.locals().email,
            type: "email",
            required: true,
            placeholder: "Enter email address",
            validators: [Validators.email],
          },
          {
            key: "fullName",
            label: this.localService.locals().username,
            type: "text",
            required: true,
            placeholder: this.localService.locals().enter_username,
            validators: [Validators.minLength(2), Validators.maxLength(100)],
          },
          {
            key: "password",
            label: this.localService.locals().password,
            type: "password",
            required: true,
            placeholder: "Enter password",
            validators: [Validators.minLength(8), Validators.maxLength(100)],
          },
          {
            key: "role",
            label: this.localService.locals().role,
            type: "select",
            required: true,
            options: this.lookupService.lookups.role,
          },
          {
            key: "isActive",
            label: this.localService.locals().active,
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
