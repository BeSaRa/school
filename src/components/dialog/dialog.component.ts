import { Component, inject, Inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from "@angular/material/dialog";
import { IconService } from "@/services/icon.service";
import { AppIcons } from "@/constants/icons.constants";
import { DialogData, DialogResult } from "@/types/dialog.types";

@Component({
  selector: "app-dialog",
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: "./dialog.component.html",
  styles: `
    ::ng-deep .mat-mdc-dialog-surface {
      border-radius: 1rem !important;
    }
  `,
})
export class DialogComponent {
  data = inject<DialogData>(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<DialogComponent>);
  iconService = inject(IconService);

  getDialogClass(): string {
    switch (this.data.type) {
      case "success":
        return `bg-green-50 dark:bg-green-900 border-green-300 dark:border-green-700`;
      case "error":
        return `bg-red-50 dark:bg-red-900 border-red-300 dark:border-red-700`;
      case "warning":
        return `bg-yellow-50 dark:bg-yellow-900 border-yellow-300 dark:border-yellow-700`;
      case "info":
        return `bg-blue-50 dark:bg-blue-900 border-blue-300 dark:border-blue-700`;
      default:
        return `bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700`;
    }
  }

  getIconClasses(): string[] {
    const iconMap: Record<string, keyof typeof AppIcons> = {
      success: "SUCCESS",
      error: "ERROR",
      warning: "WARNING",
      info: "INFO",
      confirm: "CONFIRM",
    };

    return this.iconService.getIcon(iconMap[this.data.type]);
  }

  onConfirm(): void {
    const result: DialogResult = { confirmed: true };
    this.dialogRef.close(result);
  }

  onCancel(): void {
    const result: DialogResult = { confirmed: false };
    this.dialogRef.close(result);
  }
}
