import { Component, Inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from "@angular/material/dialog";
import { DialogData, DialogResult } from "../../models/dialog.model";
import { IconService } from "@/services/icon.service";
import { AppIcons } from "@/constants/icons.constants";

@Component({
  selector: "app-dialog",
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  template: `
    <div class="p-6" [ngClass]="getDialogClass()">
      <div class="flex items-center gap-4 mb-4">
        <span [class]="getIconClasses()"></span>
        <h2 class="text-xl font-semibold">{{ data.title }}</h2>
      </div>

      <p class="mb-6 text-gray-700 dark:text-gray-300">{{ data.message }}</p>

      <div class="flex justify-end gap-3">
        <button
          *ngIf="data.type === 'confirm'"
          (click)="onCancel()"
          class="px-4 py-2 rounded-lg"
          [ngClass]="
            'bg-chat-button-secondary-bg hover:bg-chat-button-secondary-hover text-chat-button-secondary-text'
          "
        >
          {{ data.cancelText || "Cancel" }}
        </button>

        <button
          (click)="onConfirm()"
          class="px-4 py-2 rounded-lg"
          [ngClass]="
            'bg-chat-button-primary-bg hover:bg-chat-button-primary-hover text-chat-button-primary-text'
          "
        >
          {{ data.type === "confirm" ? data.confirmText || "Confirm" : "OK" }}
        </button>
      </div>
    </div>
  `,
})
export class DialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dialogRef: MatDialogRef<DialogComponent>,
    private iconService: IconService
  ) {}

  getDialogClass(): string {
    const baseClasses = "rounded-lg shadow-lg";
    switch (this.data.type) {
      case "success":
        return `${baseClasses} bg-green-50 dark:bg-green-900`;
      case "error":
        return `${baseClasses} bg-red-50 dark:bg-red-900`;
      case "warning":
        return `${baseClasses} bg-yellow-50 dark:bg-yellow-900`;
      case "info":
        return `${baseClasses} bg-blue-50 dark:bg-blue-900`;
      default:
        return `${baseClasses} bg-gray-50 dark:bg-gray-900`;
    }
  }

  getIconClasses(): string[] {
    const iconMap: Record<string, keyof typeof AppIcons> = {
      success: "CALENDAR_SUCCESS",
      error: "CALENDAR_ERROR",
      warning: "CALENDAR_WARNING",
      info: "CALENDAR_INFO",
      confirm: "CALENDAR_QUESTION",
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
