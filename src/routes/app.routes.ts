import { Routes } from "@angular/router";
import { AppRoutes } from "@/constants/routes.constants";

export const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: AppRoutes.LOGIN,
  },
  {
    path: AppRoutes.LOGIN,
    loadComponent: () => import("../views/login/login.component").then((m) => m.LoginComponent),
  },
  {
    path: "",
    loadComponent: () => import("../views/home/home.component").then((m) => m.HomeComponent),
    children: [
      {
        path: "",
        pathMatch: "full",
        redirectTo: AppRoutes.CHAT_ASSISTANT,
      },
      {
        path: AppRoutes.CHAT_ASSISTANT,
        loadComponent: () => import("../views/ai-chat-assistant/ai-chat-assistant.component").then((m) => m.AIChatAssistantComponent),
      },
      {
        path: AppRoutes.SCHOOLS,
        loadComponent: () => import("../views/schools/schools.component").then((m) => m.SchoolsComponent),
      },
      {
        path: AppRoutes.USERS,
        loadComponent: () => import("../views/users/users.component").then((m) => m.UsersComponent),
      },
      {
        path: AppRoutes.FACE_REPOSITORY,
        loadComponent: () => import("../views/face-repo/face-repo.component").then((m) => m.FaceRepoComponent),
      },
      {
        path: AppRoutes.CONTACT,
        loadComponent: () => import("../views/contact/contact.component").then((m) => m.ContactComponent),
      },
    ],
  },
  {
    path: AppRoutes.NOT_FOUND,
    loadComponent: () => import("../views/not-found/not-found.component").then((m) => m.NotFoundComponent),
  },
  { path: "**", redirectTo: AppRoutes.NOT_FOUND },
];
