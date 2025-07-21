import { Component, inject, OnInit } from "@angular/core";
import { SchoolService } from "@/services/school.service";
import { BaseCrudService } from "@/abstracts/base-crud-service";
import { FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { AdminComponent } from "@/abstracts/admin-component/admin-component";
import { School } from "@/models/school";
import { AdminTableComponent } from "@/abstracts/admin-component/components/admin-table/admin-table.component";
import { LangKeysContract } from "@/types/localization.types";
import { MatDialog } from "@angular/material/dialog";
import { AdminDialogComponent } from "@/abstracts/admin-component/components/admin-dialog/admin-dialog.component";
import { LookupService } from "@/services/lookup.service";
import { filter, switchMap } from "rxjs";

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
  private schoolService = inject(SchoolService);

  override ngOnInit() {
    this.config.set({
      itemsPerPage: 10,
      responseKey: "schools",
      columns: [
        {
          key: "name",
          label: "column_name",
          sortable: true,
          filterable: true,
          type: "text",
          filterType: "text",
        },
        {
          key: "educationLevel",
          label: "column_education_level",
          sortable: true,
          filterable: true,
          type: "custom",
          filterType: "select",
          filterOptions: this.lookupService.lookups.education_level,
          customTemplate: (value: string) => this.formatEducationLevel(`education_level_${value}` as keyof LangKeysContract),
        },
        {
          key: "schoolType.category",
          label: "column_category",
          sortable: true,
          filterable: true,
          type: "text",
          filterType: "select",
          filterOptions: this.lookupService.lookups.school_type,
        },
        {
          key: "schoolType.gender",
          label: "gender",
          sortable: true,
          filterable: true,
          type: "text",
          filterType: "select",
          filterOptions: this.lookupService.lookups.gender,
        },
        {
          key: "schoolType.religiousAffiliation",
          label: "religious_affiliation",
          sortable: true,
          filterable: true,
          type: "text",
          filterType: "select",
          filterOptions: this.lookupService.lookups.religious_affiliation,
        },
        {
          key: "location.city",
          label: "column_city",
          sortable: true,
          filterable: true,
          type: "text",
          filterType: "text",
        },
        {
          key: "contact.email",
          label: "column_email",
          sortable: true,
          filterable: true,
          type: "text",
          filterType: "text",
        },
      ],
    });
    super.ngOnInit();
  }
  private formatEducationLevel(level: keyof LangKeysContract): string {
    return level ? this.localService.locals()[level] : "";
  }

  protected openAddDialog(): void {
    this.openDialog();
  }

  protected openEditDialog(school: School): void {
    this.openDialog(school);
  }

  private openDialog(school?: School): void {
    const dialogRef = this.dialog.open(AdminDialogComponent, {
      width: "1200px",
      disableClose: true,
      data: {
        model: school,
        modelName: this.localService.locals().school,
        modelConstructor: School,
        formFields: [
          {
            key: "name",
            label: this.localService.locals().school_name,
            type: "text",
            required: true,
            placeholder: this.localService.locals().enter_school_name,
          },
          {
            key: "educationLevel",
            label: this.localService.locals().education_level,
            type: "select",
            required: true,
            options: this.lookupService.lookups.education_level,
          },
          {
            key: "schoolType.category",
            label: this.localService.locals().school_type,
            type: "select",
            required: true,
            options: this.lookupService.lookups.school_type,
            width: "1/2",
          },
          {
            key: "schoolType.gender",
            label: this.localService.locals().gender,
            type: "select",
            required: true,
            options: this.lookupService.lookups.gender,
            width: "1/2",
          },
          {
            key: "schoolType.religiousAffiliation",
            label: this.localService.locals().religious_affiliation,
            type: "select",
            required: false,
            options: this.lookupService.lookups.religious_affiliation,
          },
          {
            key: "location.country",
            label: this.localService.locals().country,
            type: "text",
            required: true,
          },
          {
            key: "location.city",
            label: this.localService.locals().city,
            type: "text",
            required: true,
          },
          {
            key: "location.area",
            label: this.localService.locals().area,
            type: "text",
            required: false,
          },
          {
            key: "location.street",
            label: this.localService.locals().street,
            type: "text",
            required: false,
          },
          {
            key: "location.coordinate.latitude",
            label: this.localService.locals().latitude,
            type: "number",
            required: false,
            width: "1/2",
            validators: [Validators.min(-90), Validators.max(90)],
          },
          {
            key: "location.coordinate.longitude",
            label: this.localService.locals().longitude,
            type: "number",
            required: false,
            width: "1/2",
            validators: [Validators.min(-180), Validators.max(180)],
          },
          {
            key: "contact.phone",
            label: this.localService.locals().phone,
            type: "text",
            required: false,
            validators: [Validators.pattern(/^\+?[0-9\s\-]{6,15}$/)],
          },
          {
            key: "contact.email",
            label: this.localService.locals().email,
            type: "email",
            required: false,
            validators: [Validators.email],
          },
          {
            key: "website.website",
            label: this.localService.locals().website,
            type: "text",
            required: false,
          },
          {
            key: "systemConfiguration.visionProvider",
            label: this.localService.locals().vision_provider,
            type: "select",
            required: true,
            options: this.lookupService.lookups.visionProvider,
          },
          {
            key: "systemConfiguration.storageProvider",
            label: this.localService.locals().storage_provider,
            type: "select",
            required: true,
            options: this.lookupService.lookups.storageProvider,
          },
          {
            key: "systemConfiguration.timezone",
            label: this.localService.locals().timezone,
            type: "text",
            required: false,
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
