import { Component, inject, OnInit, OnDestroy } from "@angular/core";
import { RouterModule, Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { IconService } from "@/services/icon.service";
import { AppIcons } from "@/constants/icons.constants";
import { NavigationService } from "../../services/navigation.service";
import { NavigationItem } from "@/types/navigation.types";
import { ProfilePopupComponent } from "../profile-popup/profile-popup.component";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { UserService } from "@/services/user.service";
import { DialogService } from "@/services/dialog.service";
import { Subscription } from "rxjs";
import { User } from "@/models/user";
import { AppRoutes } from "@/constants/routes.constants";
import { LocalService } from "@/services/local.service";

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [RouterModule, IconService, MatDialogModule],
  templateUrl: "./navbar.component.html",
  styleUrl: "./navbar.component.scss",
})
export class NavbarComponent implements OnInit, OnDestroy {
  // Services
  authService = inject(AuthService);
  navigationService = inject(NavigationService);
  dialogService = inject(DialogService);
  router = inject(Router);
  dialog = inject(MatDialog);
  userService = inject(UserService);
  localService = inject(LocalService);

  // Component properties
  currentUser!: User;
  menuItems: NavigationItem[] = this.navigationService.getMenuItems();
  readonly AppIcons = AppIcons;
  isDarkMode = false;
  isMobileMenuOpen = false;

  // Subscription management
  private userSubscription?: Subscription;

  ngOnInit() {
    // Initialize user data
    this.initializeUserData();

    // Initialize theme
    this.isDarkMode = document.documentElement.classList.contains("dark");
    this.applyTheme();
  }

  ngOnDestroy() {
    // Clean up subscriptions to prevent memory leaks
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  private initializeUserData(): void {
    // Get current user if available
    const user = this.userService.currentUser;
    if (user) {
      this.currentUser = user;
    } else {
      // Subscribe to user changes
      this.userSubscription = this.userService.currentUser$.subscribe(
        (user) => {
          if (user) {
            this.currentUser = user;
          }
        },
        (error) => {
          this.dialogService
            .error(
              this.localService.locals().error_loading_profile,
              error.message
            )
            .subscribe();
        }
      );
    }
  }
  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl(`/${AppRoutes.LOGIN}`);
  }

  toggleLanguage(): void {
    this.localService.toggleLanguage();
  }

  isActiveRoute(route: string): boolean {
    return this.navigationService.isActiveRoute(route);
  }

  toggleExpand(item: NavigationItem): void {
    // Close other expanded items
    this.menuItems.forEach((menuItem) => {
      if (menuItem.id !== item.id && menuItem.expanded) {
        menuItem.expanded = false;
      }
    });

    // Toggle the clicked item
    item.expanded = !item.expanded;
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme();
  }

  private applyTheme(): void {
    if (this.isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }

  openProfileDialog(): void {
    this.dialog.open(ProfilePopupComponent, {
      width: "500px",
      maxWidth: "90vw",
      disableClose: true,
      ariaLabel: "Profile Information",
      role: "dialog",
    });
  }

  get iconClass(): string {
    if (!this.currentUser?.role) {
      return "USER";
    }

    switch (this.currentUser.role) {
      case "teacher":
        return "TEACHER";
      case "student":
        return "STUDENT";
      case "staff":
        return "STAFF";
      case "supervisor":
        return "SUPERVISOR";
      case "superuser":
        return "SUPERUSER";
      case "school_management":
        return "SCHOOL_MANAGEMENT";
      case "moe":
        return "MOE";
      default:
        return "USER";
    }
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }
}
