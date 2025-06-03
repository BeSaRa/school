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
          this.dialogService
            .error(
              this.localService.locals().error_loading_profile,
              error.message
            )
            .subscribe(() => {
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
}
