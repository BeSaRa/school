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
      responseKey: "persons",
      columns: [
        {
          key: "nameAr",
          label: "ar_name",
          sortable: true,
          filterable: true,
          type: "text",
          filterType: "text",
        },
        {
          key: "nameEn",
          label: "en_name",
          sortable: true,
          filterable: true,
          type: "text",
          filterType: "text",
        },
        {
          key: "contactId",
          label: "contact",
          sortable: true,
          filterable: true,
          type: "text",
          filterType: "text",
        },
        {
          key: "gender",
          label: "gender",
          sortable: true,
          filterable: true,
          type: "text",
          filterType: "select",
          filterOptions: this.lookupService.lookups.gender,
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

  // private formatRole(label: keyof LangKeysContract): string {
  //   return label ? this.localService.locals()[label] : "";
  // }

  private formatStatus(isActive: boolean): string {
    const status = isActive ? this.localService.locals().status_active : this.localService.locals().status_inactive;
    const statusClass = isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";

    return `<span class="text-xs font-medium px-2.5 py-0.5 rounded ${statusClass}">${status}</span>`;
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
            key: "nameEn",
            label: this.localService.locals().en_name,
            type: "text",
            required: true,
            placeholder: this.localService.interpolate("enter_your_item", { item: "en_name" }),
            validators: [Validators.minLength(2), Validators.maxLength(100)],
          },
          {
            key: "nameAr",
            label: this.localService.locals().ar_name,
            type: "text",
            required: true,
            placeholder: this.localService.interpolate("enter_your_item", { item: "ar_name" }),
            validators: [Validators.minLength(2), Validators.maxLength(100)],
          },
          {
            key: "username",
            label: this.localService.locals().username,
            type: "text",
            required: true,
            placeholder: this.localService.interpolate("enter_your_item", { item: "username" }),
            validators: [Validators.minLength(2), Validators.maxLength(100)],
          },
          {
            key: "contactId",
            label: this.localService.locals().contact,
            type: "number",
            required: false,
            placeholder: this.localService.interpolate("enter_your_item", { item: "contact" }),
            value: null,
          },
          {
            key: "schoolId",
            label: this.localService.locals().school_id,
            type: "number",
            required: true,
            placeholder: this.localService.interpolate("enter_your_item", { item: "school_id" }),
          },
          {
            key: "password",
            label: this.localService.locals().password,
            type: "password",
            required: true,
            placeholder: this.localService.interpolate("enter_your_item", { item: "password" }),
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
            key: "createdBy",
            label: "",
            type: "hidden",
            required: true,
            value: this.userService.currentUser?.id,
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
