import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatDialog } from "@angular/material/dialog";
import { AdminTableComponent } from "../../abstracts/admin-component/components/admin-table/admin-table.component";
import { AdminDialogComponent } from "../../abstracts/admin-component/components/admin-dialog/admin-dialog.component";
import { AdminComponent } from "../../abstracts/admin-component/admin-component";
import { BaseCrudService } from "../../abstracts/base-crud-service";
import { LookupService } from "@/services/lookup.service";
import { filter, switchMap } from "rxjs";
import { AcademicLevel } from "@/models/academic-level";
import { AcademicLevelService } from "@/services/academic-level.service";
import { UserService } from "@/services/user.service";

@Component({
  selector: "app-academic-levels",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatIconModule, AdminTableComponent],
  providers: [
    {
      provide: BaseCrudService,
      useExisting: AcademicLevelService,
    },
  ],
  templateUrl: "./academic-level.component.html",
})
export class AcademicLevelComponent extends AdminComponent<AcademicLevel> implements OnInit {
  private dialog = inject(MatDialog);
  protected academicLevelService = inject(AcademicLevelService);
  protected userService = inject(UserService);
  protected lookupService = inject(LookupService);

  constructor() {
    super();
    this.config.set({
      itemsPerPage: 20,
      responseKey: "academicLevels",
      columns: [
        {
          key: "systemNameAr",
          label: "name_ar",
          sortable: true,
          filterable: true,
          type: "text",
          filterType: "text",
        },
        {
          key: "systemNameEn",
          label: "name_en",
          sortable: true,
          filterable: true,
          type: "text",
          filterType: "text",
        },
        {
          key: "levelCode",
          label: "level_code",
          sortable: true,
          filterable: true,
          type: "text",
          filterType: "text",
        },
        {
          key: "levelOrder",
          label: "level_order",
          sortable: true,
          filterable: true,
          type: "text",
          filterType: "text",
        },
        {
          key: "educationType",
          label: "education_type",
          sortable: true,
          filterable: true,
          type: "text",
          filterType: "select",
          filterOptions: this.lookupService.lookups.education_type,
        },
      ],
    });
  }

  protected openAddDialog(): void {
    this.openDialog();
  }

  protected openEditDialog(level: AcademicLevel): void {
    this.openDialog(level);
  }

  private openDialog(level?: AcademicLevel): void {
    const dialogRef = this.dialog.open(AdminDialogComponent, {
      width: "800px",
      disableClose: true,
      data: {
        model: level,
        modelName: this.localService.locals().academic_level,
        modelConstructor: AcademicLevel,
        formFields: [
          {
            key: "systemNameEn",
            label: this.localService.locals().name_en,
            type: "text",
            required: true,
            placeholder: this.localService.locals().enter_en_name,
            validators: [Validators.minLength(2), Validators.maxLength(100)],
          },
          {
            key: "systemNameAr",
            label: this.localService.locals().name_ar,
            type: "text",
            required: true,
            placeholder: this.localService.locals().enter_ar_name,
            validators: [Validators.minLength(2), Validators.maxLength(100)],
          },
          {
            key: "levelCode",
            label: this.localService.locals().level_code,
            type: "text",
            required: true,
            placeholder: this.localService.locals().enter_level_code,
          },
          {
            key: "levelOrder",
            label: this.localService.locals().level_order,
            type: "number",
            required: true,
            placeholder: this.localService.locals().enter_level_order,
          },
          {
            key: "educationType",
            label: this.localService.locals().education_type,
            type: "select",
            required: true,
            options: this.lookupService.lookups.education_type,
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
