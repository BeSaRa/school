import { Injectable, Pipe, PipeTransform } from "@angular/core";
import { AppIcons } from "../constants/icons.constants";

@Injectable({
  providedIn: "root",
})
@Pipe({
  name: "icon",
  standalone: true,
})
export class IconService implements PipeTransform {
  getIcon(iconKey: keyof typeof AppIcons | undefined): string[] {
    if (!iconKey) return [];
    return [`mdi`, `mdi-${AppIcons[iconKey]}`];
  }

  transform(iconKey: string | undefined): string[] {
    if (!iconKey) return [];
    return this.getIcon(iconKey as keyof typeof AppIcons);
  }
}
