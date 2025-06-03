import { AppIcons } from "../constants/icons.constants";
import { LangKeysContract } from "./localization.types";

export interface NavigationItem {
  id: number;
  label: keyof LangKeysContract;
  route: string;
  icon?: keyof typeof AppIcons;
  expanded?: boolean;
}
