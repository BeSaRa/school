import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AppIcons } from "../constants/icons.constants";

export interface NavigationItem {
  label: string;
  icon?: keyof typeof AppIcons;
  route: string;
  children?: (Omit<NavigationItem, "children"> & { route: string })[];
  expanded?: boolean;
}

@Injectable({
  providedIn: "root",
})
export class NavigationService {
  private menuItems: NavigationItem[] = [
    {
      label: "Schools",
      icon: "CLASSES",
      route: "/schools",
    },
    {
      label: "AI Assistant",
      icon: "COMMENT",
      route: "/chat-assistant",
    },
    {
      label: "Settings",
      icon: "SETTINGS",
      route: "/settings",
      children: [
        {
          label: "Profile",
          icon: "PROFILE",
          route: "/settings/profile",
        },
        {
          label: "Account",
          icon: "ACCOUNT",
          route: "/settings/account",
        },
      ],
    },
  ];

  constructor(private router: Router) {}

  getMenuItems(): NavigationItem[] {
    return this.menuItems;
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  isActiveRoute(route?: string): boolean {
    if (!route) return false;
    return this.router.isActive(route, {
      paths: "exact",
      queryParams: "ignored",
      fragment: "ignored",
      matrixParams: "ignored",
    });
  }
}
