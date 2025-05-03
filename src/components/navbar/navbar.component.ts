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
  imports: [RouterModule],
  templateUrl: "./navbar.component.html",
  styleUrl: "./navbar.component.scss",
})
export class NavbarComponent {
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

  getIcon(iconKey: string | undefined): string {
    if (!iconKey) return "";
    return this.iconService.getIcon(iconKey as keyof typeof AppIcons);
  }

  isActiveRoute(route: string): boolean {
    return this.navigationService.isActiveRoute(route);
  }

  toggleExpand(item: NavigationItem): void {
    item.expanded = !item.expanded;
  }
}
