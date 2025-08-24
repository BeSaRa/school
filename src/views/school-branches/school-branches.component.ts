import { Component, OnInit, inject, signal } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MatDialog } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

import { AdminComponent } from "@/abstracts/admin-component/admin-component";
import { BaseCrudService } from "@/abstracts/base-crud-service";
import { SchoolBranch } from "@/models/school-branch";
import { SchoolBranchService } from "@/services/school-branch.service";
import { SchoolService } from "@/services/school.service";
import { AdminTableComponent } from "@/abstracts/admin-component/components/admin-table/admin-table.component";
import { AdminDialogComponent } from "@/abstracts/admin-component/components/admin-dialog/admin-dialog.component";
import { School } from "@/models/school";

@Component({
  selector: "app-school-branches",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatIconModule, AdminTableComponent],
  providers: [
    {
      provide: BaseCrudService,
      useExisting: SchoolBranchService,
    },
  ],
  templateUrl: "./school-branches.component.html",
})
export class SchoolBranchesComponent extends AdminComponent<SchoolBranch> implements OnInit {
  private dialog = inject(MatDialog);
  protected schoolBranchService = inject(SchoolBranchService);
  protected schoolService = inject(SchoolService);
  protected formBuilder = inject(FormBuilder);

  schools!: School[];
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
      responseKey: "branches",
      customLoadPath: "",
      loadDataOnInit: false,
      columns: [
        { key: "nameAr", label: "ar_name", sortable: true, filterable: true, type: "text", filterType: "text" },
        { key: "nameEn", label: "en_name", sortable: true, filterable: true, type: "text", filterType: "text" },
        { key: "city", label: "city", sortable: true, filterable: true, type: "text", filterType: "text" },
        { key: "country", label: "country", sortable: true, filterable: true, type: "text", filterType: "text" },
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
          this.loadBranches(schoolId);
        } else {
          this.showTable = false;
        }
      });
    });
  }

  loadBranches(schoolId: number) {
    this.config.update((cfg) => ({
      ...cfg,
      customLoadPath: `/schools/${schoolId}/branches`,
    }));

    this.loadData();
    this.showTable = true;
  }

  protected openAddDialog(): void {
    this.openDialog();
  }

  protected openEditDialog(branch: SchoolBranch): void {
    this.openDialog(branch);
  }

  private openDialog(branch?: SchoolBranch): void {
    const { schoolId } = this.form.value;

    const dialogRef = this.dialog.open(AdminDialogComponent, {
      width: "800px",
      disableClose: true,
      data: {
        customPath: `/schools/${schoolId}/branches`,
        model: branch,
        modelName: this.localService.locals().branch,
        modelConstructor: SchoolBranch,
        formFields: [
          { key: "nameAr", label: this.localService.locals().ar_name, type: "text", required: true },
          { key: "nameEn", label: this.localService.locals().en_name, type: "text", required: true },
          { key: "country", label: this.localService.locals().country, type: "text", required: true },
          { key: "city", label: this.localService.locals().city, type: "text", required: true },
          { key: "area", label: this.localService.locals().area, type: "text" },
          { key: "street", label: this.localService.locals().street, type: "text" },
          { key: "latitude", label: "Latitude", type: "number" },
          { key: "longitude", label: "Longitude", type: "number" },
        ],
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.loadData();
    });
  }
}
