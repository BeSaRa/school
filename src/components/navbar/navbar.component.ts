import { Component, inject, OnInit } from "@angular/core";
import { RouterModule, Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { IconService } from "@/services/icon.service";
import { AppIcons } from "@/constants/icons.constants";
import { NavigationService } from "../../services/navigation.service";
import { NavigationItem } from "@/types/navigation.types";

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [RouterModule, IconService],
  templateUrl: "./navbar.component.html",
  styleUrl: "./navbar.component.scss",
})
export class NavbarComponent implements OnInit {
  private readonly iconService = inject(IconService);
  private readonly authService = inject(AuthService);
  private readonly navigationService = inject(NavigationService);
  private readonly router = inject(Router);

  menuItems: NavigationItem[] = this.navigationService.getMenuItems();
  readonly AppIcons = AppIcons;

  logout(): void {
    this.authService.logout();
    this.router.navigate(["/login"]);
  }

  isActiveRoute(route: string): boolean {
    return this.navigationService.isActiveRoute(route);
  }

  toggleExpand(item: NavigationItem): void {
    item.expanded = !item.expanded;
  }

  isDarkMode = false;

  ngOnInit() {
    this.isDarkMode = document.documentElement.classList.contains("dark");
    this.applyTheme();
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
}
