import { Component, OnInit, inject } from "@angular/core";
import { ReactiveFormsModule, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MatDialog } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { filter, switchMap } from "rxjs";

import { AdminComponent } from "@/abstracts/admin-component/admin-component";
import { BaseCrudService } from "@/abstracts/base-crud-service";
import { Student } from "@/models/student";
import { StudentService } from "@/services/student.service";
import { AdminTableComponent } from "@/abstracts/admin-component/components/admin-table/admin-table.component";
import { AdminDialogComponent } from "@/abstracts/admin-component/components/admin-dialog/admin-dialog.component";
import { LookupService } from "@/services/lookup.service";
import { UserService } from "@/services/user.service";

@Component({
  selector: "app-students",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatIconModule, AdminTableComponent],
  providers: [
    {
      provide: BaseCrudService,
      useExisting: StudentService,
    },
  ],
  templateUrl: "./students.component.html",
})
export class StudentsComponent extends AdminComponent<Student> implements OnInit {
  private dialog = inject(MatDialog);
  protected studentService = inject(StudentService);
  protected userService = inject(UserService);
  protected lookupService = inject(LookupService);

  constructor() {
    super();
    this.config.set({
      itemsPerPage: 20,
      responseKey: "items",
      columns: [
        {
          key: "studentNo",
          label: "student_no",
          sortable: true,
          filterable: true,
          type: "text",
          filterType: "text",
        },
        {
          key: "academicLevelId",
          label: "academic_level",
          sortable: true,
          filterable: true,
          type: "number",
          filterType: "text",
        },
        {
          key: "branchId",
          label: "branch",
          sortable: true,
          filterable: true,
          type: "number",
          filterType: "text",
        },
        {
          key: "personId",
          label: "person",
          sortable: true,
          filterable: true,
          type: "number",
          filterType: "text",
        },
      ],
    });
  }

  protected deleteStudent(student: Student): void {
    if (!student?.id) return;

    this.dialogService
      .confirm(this.localService.locals().delete_student, this.localService.locals().delete_student_question, this.localService.locals().delete, this.localService.locals().cancel)
      .pipe(
        filter((result) => result?.confirmed === true),
        switchMap(() => this.studentService.delete(student.id))
      )
      .subscribe({
        next: () => this.loadData(),
        error: (err) => {
          this.dialogService.error(this.localService.locals().error_deleting_student, err.message).subscribe();
        },
      });
  }

  protected openAddDialog(): void {
    this.openDialog();
  }

  protected openEditDialog(student: Student): void {
    this.openDialog(student);
  }

  private openDialog(student?: Student): void {
    const dialogRef = this.dialog.open(AdminDialogComponent, {
      width: "800px",
      disableClose: true,
      data: {
        model: student,
        modelName: this.localService.locals().student,
        modelConstructor: Student,
        formFields: [
          {
            key: "studentNo",
            label: this.localService.locals().student_no,
            type: "text",
            required: true,
            placeholder: this.localService.locals().enter_student_no,
            validators: [Validators.minLength(2), Validators.maxLength(50)],
          },
          {
            key: "academicLevelId",
            label: this.localService.locals().academic_level,
            type: "number",
            required: true,
            placeholder: this.localService.locals().enter_academic_level,
          },
          {
            key: "branchId",
            label: this.localService.locals().branch,
            type: "number",
            required: true,
            placeholder: this.localService.locals().enter_branch,
          },
          {
            key: "personId",
            label: this.localService.locals().person,
            type: "number",
            required: true,
            placeholder: this.localService.locals().enter_person,
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
  }
}
