import { Component, OnInit } from "@angular/core";
import { SchoolService } from "@/services/school.service";
import { BaseCrudService } from "@/abstracts/base-crud-service";
import { FormGroup, ReactiveFormsModule } from "@angular/forms";
import { AdminComponent } from "@/abstracts/admin-component/admin-component";
import { School } from "@/models/school";
import { AdminTableComponent } from "@/abstracts/admin-component/components/admin-table/admin-table.component";

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
      title: "Schools",
      itemsPerPage: 10,
      responseKey: "schools",
      columns: [
        {
          key: "name",
          label: "Name",
          sortable: true,
          filterable: true,
          type: "text",
          filterType: "text",
        },
        {
          key: "educationLevel",
          label: "Education Level",
          sortable: true,
          filterable: true,
          type: "custom",
          filterType: "select",
          filterOptions: [{ value: "low", label: "Low" }],
          customTemplate: (value) => this.formatEducationLevel(value),
        },
        {
          key: "schoolType.category",
          label: "Category",
          sortable: true,
          filterable: true,
          type: "text",
          filterType: "text",
        },
        {
          key: "location.city",
          label: "City",
          sortable: true,
          filterable: true,
          type: "text",
          filterType: "text",
        },
        {
          key: "contact.email",
          label: "Email",
          sortable: true,
          filterable: true,
          type: "text",
          filterType: "text",
        },
      ],
    });
    super.ngOnInit();
  }
  private formatEducationLevel(level: string): string {
    const labels = {
      all: "All Levels",
      primary: "Primary School",
      secondary: "Secondary School",
    } as const;
    return labels[level as keyof typeof labels] || level;
  }
}
