import { Component, inject, OnInit } from "@angular/core";
import { SchoolService } from "@/services/school.service";
import { BaseCrudService } from "@/abstracts/base-crud-service";
import { FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from "@angular/forms";
import { AdminComponent } from "@/abstracts/admin-component/admin-component";
import { School } from "@/models/school";
import { AdminTableComponent } from "@/abstracts/admin-component/components/admin-table/admin-table.component";
import { MatDialog } from "@angular/material/dialog";
import { AdminDialogComponent } from "@/abstracts/admin-component/components/admin-dialog/admin-dialog.component";
import { LookupService } from "@/services/lookup.service";
import { ContactService } from "@/services/contact.service";
import { forkJoin } from "rxjs";
import { UserService } from "@/services/user.service";
import { dependentContactValidator } from "@/utils/custom-validators";

@Component({
  selector: "app-schools",
  standalone: true,
  imports: [ReactiveFormsModule, AdminTableComponent],
  providers: [
    {
      provide: BaseCrudService,
      useExisting: SchoolService,
    },
  ],
  templateUrl: "./schools.component.html",
})
export class SchoolsComponent extends AdminComponent<School> implements OnInit {
  protected itemForm!: FormGroup;
  private dialog = inject(MatDialog);
  private lookupService = inject(LookupService);
  private contactService = inject(ContactService);
  private userService = inject(UserService);

  override ngOnInit() {
    this.config.set({
      itemsPerPage: 10,
      responseKey: "schools",
      columns: [
        {
          key: "nameEn",
          label: "en_name",
          sortable: true,
          filterable: true,
          type: "text",
          filterType: "text",
        },
        {
          key: "nameAr",
          label: "ar_name",
          sortable: true,
          filterable: true,
          type: "text",
          filterType: "text",
        },
        {
          key: "category",
          label: "column_category",
          sortable: true,
          filterable: true,
          type: "text",
          filterType: "select",
          filterOptions: this.lookupService.lookups.school_type,
        },
        {
          key: "contact.contact",
          label: "contact",
          sortable: true,
          filterable: true,
          type: "text",
          filterType: "text",
        },
      ],
    });
    super.ngOnInit();
  }

  protected openAddDialog(): void {
    this.openDialog();
  }

  protected openEditDialog(school: School): void {
    this.openDialog(school);
  }

  private openDialog(school?: School): void {
    forkJoin({
      contacts: this.contactService.loadAsLookups(),
    }).subscribe(({ contacts }) => {
      const dialogRef = this.dialog.open(AdminDialogComponent, {
        width: "1200px",
        disableClose: true,
        data: {
          model: school,
          modelName: this.localService.locals().school,
          modelConstructor: School,
          formFields: [
            {
              key: "nameEn",
              label: this.localService.locals().en_name,
              type: "text",
              required: true,
              placeholder: this.localService.interpolate("enter_item", { item: "en_name" }),
            },
            {
              key: "nameAr",
              label: this.localService.locals().ar_name,
              type: "text",
              required: true,
              placeholder: this.localService.interpolate("enter_item", { item: "ar_name" }),
            },
            {
              key: "category",
              label: this.localService.locals().column_category,
              type: "select",
              options: this.lookupService.lookups.school_type,
              required: true,
              placeholder: this.localService.interpolate("enter_item", { item: "column_category" }),
            },
            {
              key: "contact.contact",
              label: this.localService.locals().contact,
              type: "text",
              required: true,
              placeholder: this.localService.interpolate("enter_item", { item: "contact" }),
              validators: [dependentContactValidator("contact.type")],
              width: "1/2",
            },
            {
              key: "contact.type",
              label: this.localService.locals().contact_type,
              type: "select",
              options: this.lookupService.lookups.contact_type,
              required: true,
              placeholder: this.localService.interpolate("enter_item", { item: "contact_type" }),
              width: "1/2",
            },
            {
              key: "createdBy",
              label: "",
              type: "hidden",
              required: true,
              value: this.userService.currentUser?.id,
            },
          ],
        },
      });
      dialogRef.afterOpened().subscribe(() => {
        const form = (dialogRef.componentInstance as any).form;

        if (form) {
          const contactTypeControl = form.get(["contact.type"]);
          const contactContactControl = form.get(["contact.contact"]);

          if (contactTypeControl && contactContactControl) {
            contactTypeControl.valueChanges.subscribe(() => {
              contactContactControl.updateValueAndValidity();
            });
          }
        }
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.loadData();
        }
      });
    });
  }
}
