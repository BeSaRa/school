import { Component, OnInit, inject } from "@angular/core";
import { ReactiveFormsModule, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatDialog } from "@angular/material/dialog";

import { Contact } from "@/models/contact";
import { ContactService } from "@/services/contact.service";
import { BaseCrudService } from "@/abstracts/base-crud-service";
import { AdminComponent } from "@/abstracts/admin-component/admin-component";
import { AdminTableComponent } from "@/abstracts/admin-component/components/admin-table/admin-table.component";
import { AdminDialogComponent } from "@/abstracts/admin-component/components/admin-dialog/admin-dialog.component";
import { LookupService } from "@/services/lookup.service";
import { UserService } from "@/services/user.service";

@Component({
  selector: "app-contacts",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatIconModule, AdminTableComponent],
  providers: [
    {
      provide: BaseCrudService,
      useExisting: ContactService,
    },
  ],
  templateUrl: "./contact.component.html",
})
export class ContactComponent extends AdminComponent<Contact> implements OnInit {
  private dialog = inject(MatDialog);
  protected contactService = inject(ContactService);
  protected lookupService = inject(LookupService);
  protected userService = inject(UserService);

  constructor() {
    super();
    this.config.set({
      itemsPerPage: 20,
      responseKey: "contacts",
      customLoadPath: this.contactService.getUrlSegment() + "list_contacts",
      columns: [
        {
          key: "contact",
          label: "contact",
          sortable: true,
          filterable: true,
          type: "text",
          filterType: "text",
        },
        {
          key: "type",
          label: "type",
          sortable: true,
          filterable: true,
          type: "text",
          filterType: "select",
          filterOptions: this.lookupService.lookups.contact_type,
        },
      ],
    });
  }

  protected openAddDialog(): void {
    this.openDialog();
  }

  protected openEditDialog(contact: Contact): void {
    this.openDialog(contact);
  }

  private openDialog(contact?: Contact): void {
    const dialogRef = this.dialog.open(AdminDialogComponent, {
      width: "600px",
      disableClose: true,
      data: {
        model: contact,
        modelName: this.localService.locals().contact,
        modelConstructor: Contact,
        formFields: [
          {
            key: "contact",
            label: this.localService.locals().contact_value,
            type: "text",
            required: true,
            placeholder: this.localService.interpolate("enter_item", { item: "contact" }),
            validators: [Validators.minLength(3), Validators.maxLength(100)],
          },
          {
            key: "type",
            label: this.localService.locals().contact_type,
            type: "select",
            required: true,
            options: this.lookupService.lookups.contact_type,
          },
          {
            key: "created_by",
            label: "",
            type: "hidden",
            required: true,
            value: this.userService.currentUser?.id,
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
