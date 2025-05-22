import { Component, inject, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, Validators } from "@angular/forms";
import { User } from "@/models/user";
import { UserService } from "@/services/user.service";
import {
  AdminComponent,
  AdminComponentConfig,
} from "@/abstracts/admin-component/admin-component";
import { BaseCrudService } from "@/abstracts/base-crud-service";

@Component({
  selector: "app-user",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AdminComponent],
  providers: [
    {
      provide: BaseCrudService,
      useExisting: UserService,
    },
  ],
  templateUrl: "./users.component.html",
  styleUrl: "./users.component.scss",
})
export class UsersComponent extends AdminComponent<User> implements OnInit {
  override service = inject(UserService);

  // Convert userConfig to a signal
  protected userConfig = signal<AdminComponentConfig<User>>({
    title: "Users",
    columns: [
      {
        key: "email",
        label: "Email",
        sortable: true,
        type: "text",
      },
      {
        key: "fullName",
        label: "Full Name",
        sortable: true,
        type: "text",
      },
      {
        key: "role",
        label: "Role",
        sortable: true,
        type: "custom",
        // customTemplate: (value: string) => this.formatRole(value),
      },
      {
        key: "isActive",
        label: "Status",
        sortable: true,
        type: "custom",
        customTemplate: (value: boolean) => this.formatStatus(value),
      },
    ],
    searchFields: ["email", "fullName", "role"],
    defaultSort: "fullName",
    itemsPerPage: 15,
  });

  override ngOnInit(): void {
    this.config.set(this.userConfig());
    super.ngOnInit();
  }

  override initializeForm(): void {
    this.itemForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      fullName: [
        "",
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100),
        ],
      ],
      role: ["", [Validators.required]],
      isActive: [true],
    });
  }

  override getFormData(): Partial<User> {
    return {
      email: this.itemForm.get("email")?.value,
      fullName: this.itemForm.get("fullName")?.value,
      role: this.itemForm.get("role")?.value,
      isActive: this.itemForm.get("isActive")?.value,
    };
  }

  override populateForm(user: User): void {
    this.itemForm.patchValue({
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      isActive: user.isActive,
    });
  }

  override getItemId(user: User): any {
    return user.id;
  }

  protected getFieldClasses(fieldName: string): string {
    const control = this.itemForm.get(fieldName);
    const baseClasses =
      "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors";

    if (control?.invalid && control?.touched) {
      return `${baseClasses} border-red-300 focus:ring-red-500 focus:border-red-500`;
    }

    return `${baseClasses} border-gray-300 focus:ring-blue-500 focus:border-blue-500`;
  }

  private formatRole(role: string): string {
    if (!role) return "";

    const roleMap: Record<string, { label: string; color: string }> = {
      admin: { label: "Admin", color: "bg-red-100 text-red-800" },
      manager: { label: "Manager", color: "bg-blue-100 text-blue-800" },
      user: { label: "User", color: "bg-green-100 text-green-800" },
      viewer: { label: "Viewer", color: "bg-gray-100 text-gray-800" },
    };

    const roleInfo = roleMap[role.toLowerCase()] || {
      label: role,
      color: "bg-gray-100 text-gray-800",
    };

    return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleInfo.color}">
              ${roleInfo.label}
            </span>`;
  }

  private formatStatus(isActive: boolean): string {
    if (isActive) {
      return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <svg class="w-1.5 h-1.5 mr-1" fill="currentColor" viewBox="0 0 8 8">
                  <circle cx="4" cy="4" r="3"/>
                </svg>
                Active
              </span>`;
    } else {
      return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                <svg class="w-1.5 h-1.5 mr-1" fill="currentColor" viewBox="0 0 8 8">
                  <circle cx="4" cy="4" r="3"/>
                </svg>
                Inactive
              </span>`;
    }
  }
}
