import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { menuItems } from "../constants/navigation.constants";
import { NavigationItem } from "@/types/navigation.types";

@Injectable({
  providedIn: "root",
})
export class NavigationService {
  private menuItems: NavigationItem[] = menuItems;

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
