import { NavigationItem } from "@/types/navigation.types";
import { AppRoutes } from "./routes.constants";

export const menuItems: NavigationItem[] = [
  {
    id: 1,
    label: "AI Assistant",
    icon: "COMMENT",
    route: AppRoutes.CHAT_ASSISTANT,
  },
  {
    id: 2,
    label: "Users",
    icon: "USER",
    route: AppRoutes.USERS,
  },
  {
    id: 3,
    label: "Schools",
    icon: "SCHOOL",
    route: AppRoutes.SCHOOLS,
  },
  {
    id: 4,
    label: "Face repo",
    icon: "FACE_REPOSITORY",
    route: AppRoutes.FACE_REPOSITORY,
  },
];
