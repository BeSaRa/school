import { Component, inject, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UserService } from "../../services/user.service";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { IconService } from "@/services/icon.service";
import { DialogService } from "@/services/dialog.service";
import { Subscription } from "rxjs";
import { User } from "@/models/user";
import { LocalService } from "@/services/local.service";
import { LangKeysContract } from "@/types/localization.types";
import { AuthService } from "@/services/auth.service";
import { Router } from "@angular/router";
import { AppRoutes } from "@/constants/routes.constants";

@Component({
  selector: "app-profile-popup",
  standalone: true,
  imports: [CommonModule, MatDialogModule, IconService],
  templateUrl: "./profile-popup.component.html",
})
export class ProfilePopupComponent implements OnInit, OnDestroy {
  // Injected services
  private readonly userService = inject(UserService);
  private readonly dialogService = inject(DialogService);
  readonly localService = inject(LocalService);
  readonly dialogRef = inject(MatDialogRef<ProfilePopupComponent>);
  readonly authService = inject(AuthService);
  router = inject(Router);

  // Component properties
  currentUser!: User;
  isLoading = true;

  // Subscription management
  private userSubscription?: Subscription;

  ngOnInit(): void {
    this.loadUserProfile();
  }

  ngOnDestroy(): void {
    // Clean up subscriptions to prevent memory leaks
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  /**
   * Loads the user profile data from the UserService
   */
  private loadUserProfile(): void {
    // First try to get the current user directly
    const user = this.userService.currentUser;

    if (user) {
      this.currentUser = user;
      this.isLoading = false;
    } else {
      // If not available, subscribe to the user observable
      this.userSubscription = this.userService.currentUser$.subscribe({
        next: (user) => {
          if (user) {
            this.currentUser = user;
            this.isLoading = false;
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.dialogService.error(this.localService.locals().error_loading_profile, error.message).subscribe(() => {
            this.dialogRef.close();
          });
        },
      });
    }
  }

  /**
   * Closes the dialog
   */
  close(): void {
    this.dialogRef.close();
  }

  /**
   * Returns the appropriate role display name
   */
  getRoleLocal(role: string) {
    return this.localService.locals()[`role_${role}` as keyof LangKeysContract];
  }

  /**
   * Logout
   */
  logout(): void {
    this.dialogRef.close();
    this.authService.logout();
    this.router.navigateByUrl(`/${AppRoutes.LOGIN}`);
  }
  toggleLanguage(): void {
    this.localService.toggleLanguage();

    const newDir = this.localService.getCurrentLanguage() === "ar" ? "rtl" : "ltr";
    document.documentElement.setAttribute("dir", newDir);

    document.documentElement.classList.remove("dir-ltr", "dir-rtl");
    document.documentElement.classList.add(`dir-${newDir}`);

    this.dialogRef.close();
  }
  get isRtl() {
    return document.documentElement.getAttribute("dir") === "rtl";
  }
}
