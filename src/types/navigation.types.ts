import { AppIcons } from "../constants/icons.constants";

export interface NavigationItem {
  id: number;
  label: string;
  route: string;
  icon?: keyof typeof AppIcons;
  children?: NavigationItem[];
  expanded?: boolean;
}
