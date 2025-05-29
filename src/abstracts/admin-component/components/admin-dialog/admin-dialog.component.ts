import {
  Component,
  inject,
  computed,
  effect,
  Output,
  EventEmitter,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
} from "@angular/forms";
import { BaseCrudModel } from "@/abstracts/base-crud-model";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

export interface FormField {
  key: string;
  label: string;
  type?:
    | "text"
    | "number"
    | "email"
    | "password"
    | "textarea"
    | "select"
    | "boolean"
    | "date";
  required?: boolean;
  options?: { value: any; label: string }[];
  validators?: any[];
  disabled?: boolean;
  placeholder?: string;
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
  private data = inject(MAT_DIALOG_DATA);

  constructor() {
    this.form = this.fb.group({});
    effect(() => {
      this.initializeForm();
      if (this.isEditMode() && this.model) {
        this.form.patchValue(this.model as any);
      }
    });
  }

  ngOnInit(): void {
    this.formFields = this.data.formFields || [];
    this.model = this.data.model;
    this.modelName = this.data.modelName || "";
    this.modelConstructor = this.data.modelConstructor; // Get constructor from data
    this.initializeForm();
  }

  private initializeForm(): void {
    const formGroup: { [key: string]: any } = {};

    this.formFields.forEach((field) => {
      const validators = [];
      if (field.required) validators.push(Validators.required);
      if (field.validators) validators.push(...field.validators);

      const key = field.key as keyof typeof this.model;
      const initialValue = this.model ? (this.model[key] ?? "") : "";

      formGroup[field.key] = this.fb.control(
        { value: initialValue, disabled: field.disabled ?? false },
        validators
      );
    });

    this.form = this.fb.group(formGroup);
  }

  protected onSubmit(): void {
    if (this.form.invalid) return;

    let modelInstance: T;

    if (this.isEditMode() && this.model) {
      // Edit mode: update existing model
      modelInstance = Object.assign(this.model, this.form.getRawValue());
    } else {
      // Create mode: create new model instance
      try {
        // Create new instance using the constructor
        modelInstance = new this.modelConstructor();
        // Assign form values to the new instance
        Object.assign(modelInstance, this.form.getRawValue());
      } catch (error) {
        console.error("Error creating model instance:", error);
        return;
      }
    }

    const save$ = this.isEditMode()
      ? modelInstance.update()
      : modelInstance.create();

    save$.subscribe({
      next: (savedModel) => {
        this.saved.emit(savedModel);
        this.dialogRef.close(savedModel);
      },
      error: (error) => {
        console.error("Error saving model:", error);
      },
    });
  }

  protected onCancel(): void {
    this.cancelled.emit();
    this.dialogRef.close();
  }
}
