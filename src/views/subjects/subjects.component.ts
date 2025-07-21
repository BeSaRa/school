import { Component, OnInit, inject } from "@angular/core";
import { ReactiveFormsModule, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MatDialog } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { filter, switchMap } from "rxjs";

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
          label: "name_en",
          sortable: true,
          filterable: true,
          type: "text",
          filterType: "text",
        },
        {
          key: "nameAr",
          label: "name_ar",
          sortable: true,
          filterable: true,
          type: "text",
          filterType: "text",
        },
      ],
    });
  }

  protected deleteSubject(subject: Subject): void {
    if (!subject?.id) return;

    this.dialogService
      .confirm(this.localService.locals().delete_subject, this.localService.locals().delete_subject_question, this.localService.locals().delete, this.localService.locals().cancel)
      .pipe(
        filter((result) => result?.confirmed === true),
        switchMap(() => this.subjectService.delete(subject.id))
      )
      .subscribe({
        next: () => this.loadData(),
        error: (err) => {
          this.dialogService.error(this.localService.locals().error_deleting_subject, err.message).subscribe();
        },
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
            label: this.localService.locals().name_en,
            type: "text",
            required: true,
            placeholder: this.localService.locals().enter_en_name,
            validators: [Validators.minLength(2), Validators.maxLength(100)],
          },
          {
            key: "nameAr",
            label: this.localService.locals().name_ar,
            type: "text",
            required: true,
            placeholder: this.localService.locals().enter_ar_name,
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
