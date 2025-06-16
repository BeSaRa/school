import { Component, OnInit } from "@angular/core";
import { SchoolService } from "@/services/school.service";
import { BaseCrudService } from "@/abstracts/base-crud-service";
import { FormGroup, ReactiveFormsModule } from "@angular/forms";
import { AdminComponent } from "@/abstracts/admin-component/admin-component";
import { School } from "@/models/school";
import { AdminTableComponent } from "@/abstracts/admin-component/components/admin-table/admin-table.component";
import { LangKeysContract } from "@/types/localization.types";

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
          filterOptions: [
            { value: "low", label: "education_level_low" },
            { value: "higher", label: "education_level_higher" },
            { value: "secondary", label: "education_level_secondary" },
            { value: "primary", label: "education_level_primary" },
          ],
          customTemplate: (value: string) => this.formatEducationLevel(`education_level_${value}` as keyof LangKeysContract),
        },
        {
          key: "schoolType.category",
          label: "column_category",
          sortable: true,
          filterable: true,
          type: "text",
          filterType: "text",
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
  protected openAddDialog(): void {}
  protected openEditDialog(school: School): void {}
  protected deleteItem(school: School): void {}
}
