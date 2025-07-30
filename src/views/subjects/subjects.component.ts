import { Component, OnInit, inject } from "@angular/core";
import { ReactiveFormsModule, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MatDialog } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

import { AdminComponent } from "@/abstracts/admin-component/admin-component";
import { BaseCrudService } from "@/abstracts/base-crud-service";

import { AdminTableComponent } from "@/abstracts/admin-component/components/admin-table/admin-table.component";
import { AdminDialogComponent } from "@/abstracts/admin-component/components/admin-dialog/admin-dialog.component";
import { LookupService } from "@/services/lookup.service";
import { Subject } from "@/models/subject";
import { SubjectService } from "@/services/subject.service";

@Component({
  selector: "app-subjects",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatIconModule, AdminTableComponent],
  providers: [
    {
      provide: BaseCrudService,
      useExisting: SubjectService,
    },
  ],
  templateUrl: "./subjects.component.html",
})
export class SubjectsComponent extends AdminComponent<Subject> implements OnInit {
  private dialog = inject(MatDialog);
  protected subjectService = inject(SubjectService);
  protected lookupService = inject(LookupService);

  constructor() {
    super();
    this.config.set({
      itemsPerPage: 20,
      responseKey: "items",
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
      ],
    });
  }

  protected openAddDialog(): void {
    this.openDialog();
  }

  protected openEditDialog(subject: Subject): void {
    this.openDialog(subject);
  }

  private openDialog(subject?: Subject): void {
    const dialogRef = this.dialog.open(AdminDialogComponent, {
      width: "800px",
      disableClose: true,
      data: {
        model: subject,
        modelName: this.localService.locals().subject,
        modelConstructor: Subject,
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
