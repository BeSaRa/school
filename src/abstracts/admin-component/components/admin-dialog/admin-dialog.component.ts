import { Component, inject, computed, effect, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from "@angular/forms";
import { BaseCrudModel } from "@/abstracts/base-crud-model";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { DialogService } from "@/services/dialog.service";
import { LocalService } from "@/services/local.service";
import { LangKeysContract } from "@/types/localization.types";

export interface FormField {
  key: string;
  label: string;
  type?: "text" | "number" | "email" | "password" | "textarea" | "select" | "boolean" | "date" | "hidden";
  required?: boolean;
  options?: Array<{ value: any; label: keyof LangKeysContract }>;
  validators?: any[];
  disabled?: boolean;
  placeholder?: string;
  width?: "1" | "1/2" | "1/3";
  value?: any;
}

@Component({
  selector: "app-admin-dialog",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: "./admin-dialog.component.html",
  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }
      .required:after {
        content: " *";
        color: #ef4444;
      }
    `,
  ],
})
export class AdminDialogComponent<T extends BaseCrudModel<T, any>> {
  getErrorMessage(fieldKey: string): string | null {
    const control = this.form.get(fieldKey);
    if (!control || !control.errors || !control.touched) return null;

    if (control.hasError("required")) {
      return "This field is required.";
    }

    if (control.hasError("email")) {
      return "Invalid email format.";
    }

    if (control.hasError("minlength")) {
      const requiredLength = control.getError("minlength").requiredLength;
      return `Minimum ${requiredLength} characters required.`;
    }

    if (control.hasError("maxlength")) {
      const requiredLength = control.getError("maxlength").requiredLength;
      return `Maximum ${requiredLength} characters allowed.`;
    }

    if (control.hasError("pattern")) {
      return "Invalid format.";
    }

    return "Invalid input.";
  }
  modelName = "Item";
  model: T | null = null;
  formFields: FormField[] = [];
  modelConstructor: new () => T = null!; // Add this property

  @Output() saved = new EventEmitter<T>();
  @Output() cancelled = new EventEmitter<void>();

  protected form!: FormGroup;
  protected isEditMode = computed(() => !!(this.model as any)?.id);

  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<AdminDialogComponent<T>>);
  private dialogService = inject(DialogService);
  localService = inject(LocalService);
  private data = inject(MAT_DIALOG_DATA);

  constructor() {
    this.form = this.fb.group({});
    effect(() => {
      this.initializeForm();
      if (this.isEditMode() && this.model) {
        this.form.patchValue(this.flatten(this.model as any));
      }
    });
  }

  ngOnInit(): void {
    this.formFields = this.data.formFields || [];
    this.model = this.data.model;
    this.modelName = this.data.modelName || "";
    this.modelConstructor = this.data.modelConstructor; // Get constructor from data
    this.initializeForm();
    console.log(this.formFields);
  }

  private initializeForm(): void {
    const formGroup: { [key: string]: any } = {};

    this.formFields.forEach((field) => {
      const validators = [];
      if (field.required) validators.push(Validators.required);
      if (field.validators) validators.push(...field.validators);

      const key = field.key as keyof typeof this.model;

      const initialValue = field.value !== undefined ? field.value : this.model ? (this.model[key] ?? "") : "";
      formGroup[field.key] = this.fb.control({ value: initialValue, disabled: field.disabled ?? false }, validators);
    });

    this.form = this.fb.group(formGroup);
  }

  protected onSubmit(): void {
    if (this.form.invalid) return;

    const rawValue = this.form.getRawValue();
    const nestedValue = this.unFlatten(rawValue);

    let modelInstance: T;

    if (this.isEditMode() && this.model) {
      modelInstance = Object.assign(this.model, nestedValue);
    } else {
      try {
        modelInstance = new this.modelConstructor();
        Object.assign(modelInstance, nestedValue);
      } catch (error) {
        console.error("Error creating model instance:", error);
        return;
      }
    }

    const save$ = this.isEditMode() ? modelInstance.update() : modelInstance.create();

    save$.subscribe({
      next: (savedModel) => {
        this.saved.emit(savedModel);
        this.dialogRef.close(savedModel);
      },
      error: (error) => {
        this.dialogService.error(this.localService.locals().error_saving_model, error.message).subscribe();
      },
    });
  }

  protected onCancel(): void {
    this.cancelled.emit();
    this.dialogRef.close();
  }

  private flatten(obj: Record<string, any>, parentKey = "", result: Record<string, any> = {}): Record<string, any> {
    for (const key in obj) {
      if (!obj.hasOwnProperty(key)) continue;

      const newKey = parentKey ? `${parentKey}.${key}` : key;
      const value = obj[key];

      if (value && typeof value === "object" && !Array.isArray(value)) {
        this.flatten(value, newKey, result);
      } else {
        result[newKey] = value;
      }
    }
    return result;
  }

  unFlatten(flatObj: Record<string, any>): any {
    const result: Record<string, any> = {};

    for (const flatKey in flatObj) {
      const keys = flatKey.split(".");
      keys.reduce((acc, key, index) => {
        if (index === keys.length - 1) {
          acc[key] = flatObj[flatKey];
          return;
        }
        acc[key] = acc[key] || {};
        return acc[key];
      }, result);
    }

    return result;
  }
}
