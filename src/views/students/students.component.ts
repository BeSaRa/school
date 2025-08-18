import { Component, OnInit, inject, signal } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MatDialog } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

import { AdminComponent } from "@/abstracts/admin-component/admin-component";
import { BaseCrudService } from "@/abstracts/base-crud-service";
import { Student } from "@/models/student";
import { StudentService } from "@/services/student.service";
import { AdminTableComponent } from "@/abstracts/admin-component/components/admin-table/admin-table.component";
import { AdminDialogComponent } from "@/abstracts/admin-component/components/admin-dialog/admin-dialog.component";
import { LookupService } from "@/services/lookup.service";
import { UserService } from "@/services/user.service";
import { SchoolService } from "@/services/school.service";
import { forkJoin } from "rxjs";
import { AcademicLevelService } from "@/services/academic-level.service";

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
  protected schoolService = inject(SchoolService);
  protected formBuilder = inject(FormBuilder);
  protected academicLevelService = inject(AcademicLevelService);
  schools!: { value: number; label: string }[];
  branches!: { value: number; label: string }[];
  schoolsLoading = signal(true);
  branchesLoading = signal(true);

  showTable = false;
  form!: FormGroup;

  constructor() {
    super();
    this.form = this.formBuilder.group({
      schoolId: [null, [Validators.required]],
      branchId: [null, [Validators.required]],
    });

    this.config.set({
      itemsPerPage: 20,
      responseKey: "students",
      customLoadPath: "",
      loadDataOnInit: false,
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
          key: "academicLevel.educationType",
          label: "academic_level",
          sortable: true,
          filterable: true,
          type: "number",
          filterType: "text",
        },
        {
          key: "personalInfo.nameAr",
          label: "person",
          sortable: true,
          filterable: true,
          type: "text",
          filterType: "text",
        },
        {
          key: "school.nameAr",
          label: "school",
          sortable: true,
          filterable: true,
          type: "text",
          filterType: "text",
        },
      ],
    });
  }

  override ngOnInit(): void {
    super.ngOnInit();

    this.schoolService.loadAsLookups().subscribe((data) => {
      this.schools = data;
      this.schoolsLoading.set(false);
      this.form.get("schoolId")?.valueChanges.subscribe((schoolId) => {
        if (schoolId) {
          this.branchesLoading.set(true);
          this.schoolService.loadBranchesAsLookup(schoolId).subscribe((data) => {
            this.branches = data;
            this.branchesLoading.set(false);
            this.form.get("branchId")?.reset(null);
          });
        } else {
          this.branches = [];
          this.form.get("branchId")?.reset(null);
        }
      });
      this.form.get("branchId")?.valueChanges.subscribe((value) => {
        if (value) this.form.updateValueAndValidity();
        if (this.form.valid) this.loadStudents();
      });
    });
  }

  loadStudents() {
    if (this.form.invalid) return;

    const { schoolId, branchId } = this.form.value;
    this.config.update((cfg) => ({
      ...cfg,
      customLoadPath: `/schools/${schoolId}/branches/${branchId}/students`,
    }));

    this.loadData();
    this.showTable = true;
  }

  protected openAddDialog(): void {
    this.openDialog();
  }

  protected openEditDialog(student: Student): void {
    this.openDialog(student);
  }

  private openDialog(student?: Student): void {
    const { schoolId, branchId } = this.form.value;

    forkJoin({
      academicLevels: this.academicLevelService.loadAsLookups(),
      persons: this.userService.loadAsLookups(),
    }).subscribe(({ academicLevels, persons }) => {
      const dialogRef = this.dialog.open(AdminDialogComponent, {
        width: "800px",
        disableClose: true,
        data: {
          customPath: `/schools/${schoolId}/branches/${branchId}/students`,
          model: student,
          modelName: this.localService.locals().student,
          modelConstructor: Student,
          formFields: [
            {
              key: "studentNo",
              label: this.localService.locals().student_no,
              type: "text",
              required: true,
              placeholder: this.localService.interpolate("enter_item", { item: "student_no" }),
              validators: [Validators.minLength(2), Validators.maxLength(50)],
            },
            // {
            //   key: "nameEn",
            //   label: this.localService.locals().en_name,
            //   type: "text",
            //   required: true,
            //   placeholder: this.localService.interpolate("enter_item", { item: "en_name" }),
            //   validators: [Validators.minLength(2), Validators.maxLength(50), Validators.pattern(Patterns.ENGLISH_ONLY)],
            // },
            // {
            //   key: "nameAr",
            //   label: this.localService.locals().ar_name,
            //   type: "text",
            //   required: true,
            //   placeholder: this.localService.interpolate("enter_item", { item: "ar_name" }),
            //   validators: [Validators.minLength(2), Validators.maxLength(50), Validators.pattern(Patterns.ARABIC_ONLY)],
            // },
            // {
            //   key: "username",
            //   label: this.localService.locals().username,
            //   type: "text",
            //   required: true,
            //   placeholder: this.localService.interpolate("enter_item", { item: "username" }),
            //   validators: [Validators.minLength(2), Validators.maxLength(50), Validators.pattern(Patterns.USERNAME)],
            // },
            // {
            //   key: "password",
            //   label: this.localService.locals().password,
            //   type: "password",
            //   required: true,
            //   placeholder: this.localService.interpolate("enter_item", { item: "password" }),
            //   validators: [Validators.minLength(2), Validators.maxLength(50), Validators.pattern(Patterns.PASSWORD)],
            // },
            {
              key: "academicLevelId",
              label: this.localService.locals().academic_level,
              type: "select",
              options: academicLevels,
              required: true,
              placeholder: this.localService.interpolate("enter_item", { item: "academic_level" }),
            },
            {
              key: "personId",
              label: this.localService.locals().person,
              type: "select",
              options: persons,
              required: true,
              placeholder: this.localService.interpolate("enter_item", { item: "person" }),
            },
            // {
            //   key: "branchId",
            //   label: "",
            //   type: "hidden",
            //   required: true,
            //   value: branchId,
            // },
            // {
            //   key: "role",
            //   label: "",
            //   type: "hidden",
            //   required: true,
            //   value: "student",
            // },
            // {
            //   key: "description",
            //   label: this.localService.locals().description,
            //   type: "text",
            //   required: false,
            //   placeholder: this.localService.interpolate("enter_item", { item: "description" }),
            // },
            // {
            //   key: "dateOfBirth",
            //   label: this.localService.locals().date_of_birth,
            //   type: "date",
            //   required: false,
            //   placeholder: this.localService.interpolate("enter_item", { item: "date_of_birth" }),
            // },
            // {
            //   key: "gender",
            //   label: this.localService.locals().gender,
            //   type: "select",
            //   required: false,
            //   options: this.lookupService.lookups.gender,
            //   placeholder: this.localService.interpolate("enter_item", { item: "gender" }),
            // },
            // {
            //   key: "createdBy",
            //   label: "",
            //   type: "hidden",
            //   required: true,
            //   value: this.userService.currentUser?.id,
            // },
            // {
            //   key: "isActive",
            //   label: this.localService.locals().active,
            //   type: "boolean",
            // },
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
