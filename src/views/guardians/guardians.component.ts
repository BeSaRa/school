import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatDialog } from "@angular/material/dialog";
import { AdminTableComponent } from "../../abstracts/admin-component/components/admin-table/admin-table.component";
import { AdminDialogComponent } from "../../abstracts/admin-component/components/admin-dialog/admin-dialog.component";
import { AdminComponent } from "../../abstracts/admin-component/admin-component";
import { LookupService } from "@/services/lookup.service";
import { UserService } from "@/services/user.service";
import { ContactService } from "@/services/contact.service";
import { forkJoin } from "rxjs";
import { GuardianService } from "@/services/guardian.service";
import { Guardian } from "@/models/guardian";
import { BaseCrudService } from "@/abstracts/base-crud-service";
import { BRANCH_ID, SCHOOL_ID, STUDENT_ID } from "./injection-token-inputs";

@Component({
  selector: "app-guardians",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatIconModule, AdminTableComponent],
  providers: [
    {
      provide: BaseCrudService,
      useExisting: GuardianService,
    },
  ],
  templateUrl: "./guardians.component.html",
})
export class GuardiansComponent extends AdminComponent<Guardian> implements OnInit {
  private dialog = inject(MatDialog);
  protected guardianService = inject(GuardianService);
  protected userService = inject(UserService);
  protected contactService = inject(ContactService);
  protected lookupService = inject(LookupService);

  studentId = inject(STUDENT_ID);
  schoolId = inject(SCHOOL_ID);
  branchId = inject(BRANCH_ID);

  constructor() {
    super();
    this.config.set({
      itemsPerPage: 20,
      customLoadPath: `/schools/${this.schoolId}/branches/${this.branchId}/students/${this.studentId}/guardians`,
      responseKey: "guardians",
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
          key: "relation",
          label: "relation",
          sortable: true,
          filterable: true,
          type: "text",
          filterType: "select",
          filterOptions: this.lookupService.lookups.relation_options,
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
      ],
    });
  }

  protected openAddDialog(): void {
    this.openDialog();
  }

  protected openEditDialog(guardian: Guardian): void {
    this.openDialog(guardian);
  }

  private openDialog(guardian?: Guardian): void {
    forkJoin({
      persons: this.userService.loadAsLookups("persons"),
    }).subscribe(({ persons }) => {
      const dialogRef = this.dialog.open(AdminDialogComponent, {
        width: "900px",
        disableClose: true,
        data: {
          model: guardian,
          modelName: this.localService.locals().guardians,
          modelConstructor: Guardian,
          customPath: `/schools/${this.schoolId}/branches/${this.branchId}/students/${this.studentId}/guardians`,
          formFields: [
            {
              key: "relation",
              label: this.localService.locals().relation,
              type: "select",
              required: true,
              options: this.lookupService.lookups.relation_options,
              placeholder: this.localService.interpolate("enter_item", { item: "relation" }),
            },
            {
              key: "personId",
              label: this.localService.locals().person,
              type: "select",
              options: persons,
              required: true,
              placeholder: this.localService.interpolate("enter_item", { item: "person" }),
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

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.loadData();
        }
      });
    });
  }
}
