import { Injectable } from "@angular/core";
import { AppIcons } from "../constants/icons.constants";

@Injectable({
  providedIn: "root",
})
export class IconService {
  getIcon(iconKey: keyof typeof AppIcons | undefined): string {
    return iconKey ? `mdi mdi-${AppIcons[iconKey]}` : "";
  }
}
