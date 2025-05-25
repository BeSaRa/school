// schools.component.ts
import { Component, inject, signal } from "@angular/core";
import { School } from "@/models/school";
import { SchoolService } from "@/services/school.service";
import {
  AdminComponent,
  AdminComponentConfig,
} from "@/abstracts/admin-component/admin-component";
import { BaseCrudService } from "@/abstracts/base-crud-service";
import { ReactiveFormsModule, Validators } from "@angular/forms";

@Component({
  selector: "app-schools",
  standalone: true,
  imports: [ReactiveFormsModule],
  providers: [
    {
      provide: BaseCrudService,
      useExisting: SchoolService,
    },
  ],
  templateUrl: "./schools.component.html",
})
export class SchoolsComponent {
  // override service = inject(SchoolService);
  // protected schoolConfig = signal<AdminComponentConfig<School>>({
  //   title: "Schools",
  //   enableGlobalSearch: true,
  //   globalSearchFields: ["fullName", "email"],
  //   itemsPerPage: 15,
  //   columns: [
  //     {
  //       key: "name",
  //       label: "Name",
  //       sortable: true,
  //       filterable: true,
  //       type: "text",
  //       filterType: "text",
  //     },
  //     {
  //       key: "educationLevel",
  //       label: "Education Level",
  //       sortable: true,
  //       filterable: true,
  //       type: "custom",
  //       filterType: "select",
  //       filterOptions: [{ value: "low", label: "Low" }],
  //       customTemplate: (value) => this.formatEducationLevel(value),
  //     },
  //     {
  //       key: "schoolType.category",
  //       label: "Category",
  //       sortable: true,
  //       filterable: true,
  //       type: "text",
  //       filterType: "text",
  //     },
  //     {
  //       key: "location.city",
  //       label: "City",
  //       sortable: true,
  //       filterable: true,
  //       type: "text",
  //       filterType: "text",
  //     },
  //     {
  //       key: "contact.email",
  //       label: "Email",
  //       sortable: true,
  //       filterable: true,
  //       type: "text",
  //       filterType: "text",
  //     },
  //   ],
  // });
  // override ngOnInit() {
  //   this.config.set(this.schoolConfig());
  //   super.ngOnInit();
  // }
  // override initializeForm() {
  //   this.itemForm = this.fb.group({
  //     name: ["", Validators.required],
  //     educationLevel: ["", Validators.required],
  //     schoolType: this.fb.group({
  //       category: ["", Validators.required],
  //       gender: ["", Validators.required],
  //       religiousAffiliation: ["", Validators.required],
  //     }),
  //     location: this.fb.group({
  //       country: ["", Validators.required],
  //       city: ["", Validators.required],
  //       area: ["", Validators.required],
  //       street: ["", Validators.required],
  //       coordinate: this.fb.group({
  //         latitude: [0, Validators.required],
  //         longitude: [0, Validators.required],
  //       }),
  //     }),
  //     contact: this.fb.group({
  //       phone: ["", Validators.required],
  //       email: ["", [Validators.required, Validators.email]],
  //       website: ["", Validators.required],
  //     }),
  //     systemConfiguration: this.fb.group({
  //       visionProvider: ["", Validators.required],
  //       storageProvider: ["", Validators.required],
  //       timezone: ["", Validators.required],
  //       cameras: [[]],
  //     }),
  //   });
  // }
  // override getFormData() {
  //   return {
  //     ...this.itemForm.value,
  //     schoolType: {
  //       ...this.itemForm.value.schoolType,
  //       id: this.editingItem()?.schoolType?.id,
  //     },
  //     location: {
  //       ...this.itemForm.value.location,
  //       id: this.editingItem()?.location?.id,
  //     },
  //     contact: {
  //       ...this.itemForm.value.contact,
  //       id: this.editingItem()?.contact?.id,
  //     },
  //     systemConfiguration: {
  //       ...this.itemForm.value.systemConfiguration,
  //       id: this.editingItem()?.systemConfiguration?.id,
  //     },
  //   };
  // }
  // override populateForm(school: School) {
  //   const cleanSchool = {
  //     ...school,
  //     schoolType: { ...school.schoolType, id: undefined },
  //     location: { ...school.location, id: undefined },
  //     contact: { ...school.contact, id: undefined },
  //     systemConfiguration: { ...school.systemConfiguration, id: undefined },
  //   };
  //   this.itemForm.patchValue(cleanSchool);
  // }
  // private formatEducationLevel(level: string): string {
  //   const labels = {
  //     all: "All Levels",
  //     primary: "Primary School",
  //     secondary: "Secondary School",
  //   } as const;
  //   return labels[level as keyof typeof labels] || level;
  // }
}
