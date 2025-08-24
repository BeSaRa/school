import { Component, OnInit, inject } from "@angular/core";
import { ReactiveFormsModule, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MatDialog } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { forkJoin } from "rxjs";

import { AdminComponent } from "@/abstracts/admin-component/admin-component";
import { BaseCrudService } from "@/abstracts/base-crud-service";

import { AdminTableComponent } from "@/abstracts/admin-component/components/admin-table/admin-table.component";
import { AdminDialogComponent } from "@/abstracts/admin-component/components/admin-dialog/admin-dialog.component";

import { Course } from "@/models/course";
import { CourseService } from "@/services/course.service";
import { SubjectService } from "@/services/subject.service";
import { AcademicLevelService } from "@/services/academic-level.service";
import { LookupService } from "@/services/lookup.service";
import { StaffService } from "@/services/staff.service";
import { UserService } from "@/services/user.service";
import { SchoolService } from "@/services/school.service";

@Component({
  selector: "app-courses",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatIconModule, AdminTableComponent],
  providers: [
    {
      provide: BaseCrudService,
      useExisting: CourseService,
    },
  ],
  templateUrl: "./courses.component.html",
})
export class CoursesComponent extends AdminComponent<Course> implements OnInit {
  private dialog = inject(MatDialog);

  protected courseService = inject(CourseService);
  protected subjectService = inject(SubjectService);
  protected academicLevelService = inject(AcademicLevelService);
  protected schoolService = inject(SchoolService);
  protected userService = inject(UserService);
  protected lookupService = inject(LookupService);

  constructor() {
    super();
    this.config.set({
      itemsPerPage: 20,
      responseKey: "courses",
      columns: [
        {
          key: "courseNo",
          label: "course_no",
          sortable: true,
          filterable: true,
          type: "text",
          filterType: "text",
        },
        {
          key: "description",
          label: "description",
          sortable: true,
          filterable: true,
          type: "text",
          filterType: "text",
        },
        {
          key: "academicLevel.systemNameAr",
          label: "academic_level",
          sortable: true,
          filterable: true,
          type: "text",
          filterType: "text",
        },
        {
          key: "subject.nameAr",
          label: "subject",
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

  protected openEditDialog(course: Course): void {
    this.openDialog(course);
  }

  private openDialog(course?: Course): void {
    forkJoin({
      subjects: this.subjectService.loadAsLookups(),
      academicLevels: this.academicLevelService.loadAsLookups(),
      teachers: this.schoolService.loadStaffsAsLookups(),
    }).subscribe(({ subjects, academicLevels, teachers }) => {
      const dialogRef = this.dialog.open(AdminDialogComponent, {
        width: "800px",
        disableClose: true,
        data: {
          model: course,
          modelName: this.localService.locals().course,
          modelConstructor: Course,
          formFields: [
            {
              key: "courseNo",
              label: this.localService.locals().course_no,
              type: "text",
              required: true,
              placeholder: this.localService.interpolate("enter_your_item", { item: "course_no" }),
              validators: [Validators.minLength(1), Validators.maxLength(50)],
            },
            {
              key: "description",
              label: this.localService.locals().description,
              type: "textarea",
              required: false,
              placeholder: this.localService.interpolate("enter_your_item", { item: "description" }),
              validators: [Validators.maxLength(500)],
            },
            {
              key: "subjectId",
              label: this.localService.locals().subject,
              type: "select",
              options: subjects,
              required: true,
              placeholder: this.localService.interpolate("enter_your_item", { item: "subject" }),
              value: course?.subjectId ?? null,
            },
            {
              key: "academicLevelId",
              label: this.localService.locals().academic_level,
              type: "select",
              options: academicLevels,
              required: true,
              placeholder: this.localService.interpolate("enter_your_item", { item: "academic_level" }),
              value: course?.academicLevelId ?? null,
            },
            {
              key: "teacherId",
              label: this.localService.locals().teacher,
              type: "select",
              options: teachers,
              required: true,
              placeholder: this.localService.interpolate("enter_your_item", { item: "teacher" }),
              value: course?.teacherId ?? null,
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
