import { Component, OnInit, inject, signal } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MatDialog } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

import { AdminComponent } from "@/abstracts/admin-component/admin-component";
import { BaseCrudService } from "@/abstracts/base-crud-service";
import { Staff } from "@/models/staff";
import { SchoolService } from "@/services/school.service";
import { AdminTableComponent } from "@/abstracts/admin-component/components/admin-table/admin-table.component";
import { AdminDialogComponent } from "@/abstracts/admin-component/components/admin-dialog/admin-dialog.component";
import { StaffService } from "@/services/staff.service";
import { forkJoin } from "rxjs";
import { UserService } from "@/services/user.service";
import { School } from "@/models/school";
import { LookupItem } from "@/services/lookup.service";

@Component({
  selector: "app-staff",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatIconModule, AdminTableComponent],
  providers: [
    {
      provide: BaseCrudService,
      useExisting: StaffService,
    },
  ],
  templateUrl: "./staff.component.html",
})
export class StaffComponent extends AdminComponent<Staff> implements OnInit {
  private dialog = inject(MatDialog);
  protected staffService = inject(StaffService);
  protected schoolService = inject(SchoolService);
  protected userService = inject(UserService);
  protected formBuilder = inject(FormBuilder);

  schools!: LookupItem[];
  schoolsLoading = signal(true);

  showTable = false;
  form!: FormGroup;

  constructor() {
    super();
    this.form = this.formBuilder.group({
      schoolId: [null, [Validators.required]],
    });

    this.config.set({
      itemsPerPage: 20,
      responseKey: "staffs",
      customLoadPath: "",
      loadDataOnInit: false,
      columns: [
        { key: "personalInfo.nameAr", label: "ar_name", sortable: true, filterable: true, type: "text", filterType: "text" },
        { key: "personalInfo.nameEn", label: "en_name", sortable: true, filterable: true, type: "text", filterType: "text" },
        { key: "personalInfo.username", label: "username", sortable: true, filterable: true, type: "text", filterType: "text" },
        { key: "staffInfo.role", label: "role", sortable: true, filterable: true, type: "text", filterType: "text" },
        { key: "staffInfo.title", label: "title", sortable: true, filterable: true, type: "text", filterType: "text" },
        { key: "specialization", label: "specialization", sortable: true, filterable: true, type: "text", filterType: "text" },
      ],
    });
  }

  override ngOnInit(): void {
    super.ngOnInit();

    this.schoolService.loadAsLookups("schools").subscribe((data) => {
      this.schools = data;
      this.schoolsLoading.set(false);

      this.form.get("schoolId")?.valueChanges.subscribe((schoolId) => {
        if (schoolId) {
          this.loadStaff(schoolId);
        } else {
          this.showTable = false;
        }
      });
    });
  }

  loadStaff(schoolId: number) {
    this.config.update((cfg) => ({
      ...cfg,
      customLoadPath: `/schools/${schoolId}/staff`,
    }));

    this.loadData();
    this.showTable = true;
  }

  protected openAddDialog(): void {
    this.openDialog();
  }

  protected openEditDialog(staff: Staff): void {
    this.openDialog(staff);
  }

  private openDialog(staff?: Staff): void {
    const { schoolId } = this.form.value;
    forkJoin({
      users: this.userService.loadAsLookups("users"),
    }).subscribe(({ users }) => {
      const dialogRef = this.dialog.open(AdminDialogComponent, {
        width: "800px",
        disableClose: true,
        data: {
          customPath: `/schools/${schoolId}/staff`,
          model: staff,
          modelName: this.localService.locals().staff,
          modelConstructor: Staff,
          formFields: [
            { key: "specialization", label: this.localService.locals().specialization, type: "text" },
            { key: "personId", label: this.localService.locals().user, type: "select", options: users },
          ],
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) this.loadData();
      });
    });
  }
}
