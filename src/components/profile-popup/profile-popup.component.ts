import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UserService } from "../../services/user.service";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { IconService } from "@/services/icon.service";

@Component({
  selector: "app-profile-popup",
  standalone: true,
  imports: [CommonModule, MatDialogModule, IconService],
  templateUrl: "./profile-popup.component.html",
})
export class ProfilePopupComponent {
  userService = inject(UserService);
  dialogRef = inject(MatDialogRef<ProfilePopupComponent>);
  user$ = this.userService.getCurrentUser();

  close(): void {
    this.dialogRef.close();
  }
}
