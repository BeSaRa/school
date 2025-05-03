import { NavigationItem } from "../types/navigation.types";
import { AppIcons } from "./icons.constants";

export const menuItems: NavigationItem[] = [
  {
    id: 1,
    label: "AI Assistant",
    icon: "COMMENT",
    route: "/chat-assistant",
  },
  {
    id: 2,
    label: "Schools",
    icon: "CLASSES",
    route: "/schools",
  },
];
