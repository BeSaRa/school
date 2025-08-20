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
  {
    id: 5,
    label: "contact",
    icon: "EMAIL",
    route: AppRoutes.CONTACT,
  },
  {
    id: 6,
    label: "academic_level",
    icon: "EDUCATION_LEVEL",
    route: AppRoutes.ACADEMIC_LEVEL,
  },
  {
    id: 7,
    label: "students",
    icon: "STUDENTS",
    route: AppRoutes.STUDENTS,
  },
  {
    id: 8,
    label: "branches",
    icon: "BRANCHES",
    route: AppRoutes.BRANCHES,
  },
  {
    id: 9,
    label: "subjects",
    icon: "CODE",
    route: AppRoutes.SUBJECTS,
  },
  {
    id: 10,
    label: "staff",
    icon: "STAFF",
    route: AppRoutes.STAFF,
  },
  // {
  //   id: 8,
  //   label: "sources",
  //   icon: "SOURCES",
  //   route: AppRoutes.SOURCES,
  // },
];
