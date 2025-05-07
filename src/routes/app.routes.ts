import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "login",
  },
  {
    path: "login",
    loadComponent: () =>
      import("../views/login/login.component").then((m) => m.LoginComponent),
  },
  {
    path: "",
    loadComponent: () =>
      import("../views/home/home.component").then((m) => m.HomeComponent),
    children: [
      {
        path: "",
        pathMatch: "full",
        redirectTo: "chat-assistant",
      },
      {
        path: "chat-assistant",
        loadComponent: () =>
          import("../views/ai-chat-assistant/ai-chat-assistant.component").then(
            (m) => m.AIChatAssistantComponent
          ),
      },
      {
        path: "schools",
        loadComponent: () =>
          import("../views/schools/schools.component").then(
            (m) => m.SchoolsComponent
          ),
      },
    ],
  },
  {
    path: "404",
    loadComponent: () =>
      import("../views/not-found/not-found.component").then(
        (m) => m.NotFoundComponent
      ),
  },
  { path: "**", redirectTo: "404" },
];
