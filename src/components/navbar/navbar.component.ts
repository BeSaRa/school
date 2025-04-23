import { Component, inject } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { IconService } from "@/services/icon.service";
import { AppIcons } from "@/constants/icons.constants";
import {
  NavigationService,
  NavigationItem,
} from "../../services/navigation.service";

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [RouterModule],
  templateUrl: "./navbar.component.html",
  styles: [],
})
export class NavbarComponent {
  private iconService = inject(IconService);
  private authService = inject(AuthService);
  private readonly navigationService = inject(NavigationService);

  menuItems: NavigationItem[] = [];
  AppIcons = AppIcons;

  ngOnInit() {
    this.menuItems = this.navigationService.getMenuItems();
  }

  logout(): void {
    this.authService.logout();
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
