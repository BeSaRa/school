import { inject, Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { DialogComponent } from "../components/dialog/dialog.component";
import { DialogData, DialogResult } from "../types/dialog.types";

@Injectable({
  providedIn: "root",
})
export class DialogService {
  dialog = inject(MatDialog);

  open(data: DialogData): Observable<DialogResult> {
    const dialogRef = this.dialog.open(DialogComponent, {
      data,
      width: "600px",
      maxWidth: "90vw",
      disableClose: true,
      ariaLabel: data.title,
      role: "dialog",
    });

    return dialogRef.afterClosed();
  }

  confirm(
    title: string,
    message: string,
    confirmText?: string,
    cancelText?: string
  ): Observable<DialogResult> {
    return this.open({
      type: "confirm",
      title,
      message,
      confirmText,
      cancelText,
    });
  }

  success(title: string, message: string): Observable<DialogResult> {
    return this.open({
      type: "success",
      title,
      message,
    });
  }

  error(title: string, message: string): Observable<DialogResult> {
    return this.open({
      type: "error",
      title,
      message,
    });
  }

  warning(title: string, message: string): Observable<DialogResult> {
    return this.open({
      type: "warning",
      title,
      message,
    });
  }

  info(title: string, message: string): Observable<DialogResult> {
    return this.open({
      type: "info",
      title,
      message,
    });
  }
}
