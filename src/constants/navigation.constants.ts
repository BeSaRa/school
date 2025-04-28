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
  // {
  //   id: 3,
  //   label: "Settings",
  //   icon: "SETTINGS",
  //   route: "/settings",
  //   children: [
  //     {
  //       id: 31,
  //       label: "Profile",
  //       icon: "PROFILE",
  //       route: "/settings/profile",
  //     },
  //     {
  //       id: 32,
  //       label: "Account",
  //       icon: "ACCOUNT",
  //       route: "/settings/account",
  //     },
  //   ],
  // },
];
