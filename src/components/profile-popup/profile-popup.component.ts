import { Component, inject, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UserService } from "../../services/user.service";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { IconService } from "@/services/icon.service";
import { User } from "@/types/user.types";
import { DialogService } from "@/services/dialog.service";
import { Subscription } from "rxjs";

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
          } else {
            this.handleUserNotFound();
          }
        },
        error: (error) => {
          this.handleError(error);
        },
      });
    }
  }

  /**
   * Handles the case when user data is not found
   */
  private handleUserNotFound(): void {
    this.isLoading = false;
    this.dialogService
      .error(
        "User Not Found",
        "Unable to retrieve your profile information. Please log in again."
      )
      .subscribe(() => {
        this.dialogRef.close();
      });
  }

  /**
   * Handles any errors that occur during profile loading
   */
  private handleError(error: any): void {
    this.isLoading = false;
    this.dialogService
      .error(
        "Error Loading Profile",
        "An error occurred while loading your profile. Please try again later."
      )
      .subscribe(() => {
        this.dialogRef.close();
      });
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
  getRoleDisplayName(): string {
    if (!this.currentUser?.role) return "User";

    // Convert snake_case or lowercase to Title Case
    const role = this.currentUser.role
      .replace(/_/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

    return role;
  }
}
