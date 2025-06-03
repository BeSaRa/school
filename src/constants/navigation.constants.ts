import { NavigationItem } from "@/types/navigation.types";
import { AppRoutes } from "./routes.constants";

export const menuItems: NavigationItem[] = [
  {
    id: 1,
    label: "ai_assistant",
    icon: "COMMENT",
    route: AppRoutes.CHAT_ASSISTANT,
  },
  {
    id: 2,
    label: "users",
    icon: "USER",
    route: AppRoutes.USERS,
  },
  {
    id: 3,
    label: "schools",
    icon: "SCHOOL",
    route: AppRoutes.SCHOOLS,
  },
  {
    id: 4,
    label: "face_repo",
    icon: "FACE_REPOSITORY",
    route: AppRoutes.FACE_REPOSITORY,
  },
];
