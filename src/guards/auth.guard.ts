import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { ECookieService } from "../services/e-cookie.service";

export const authGuard = () => {
  const cookieService = inject(ECookieService);
  const router = inject(Router);

  const accessToken = cookieService.get("access_token");

  if (!accessToken) {
    return router.createUrlTree(["/auth/login"]);
  }

  return true;
};
