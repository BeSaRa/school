import { HttpInterceptorFn } from "@angular/common/http";
import { isPlatformBrowser } from "@angular/common";
import { inject, PLATFORM_ID } from "@angular/core";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);

  if (req.url.includes("login")) {
    return next(req);
  }

  // Only access localStorage in browser environment
  if (isPlatformBrowser(platformId)) {
    const token = localStorage.getItem("access_token");

    if (token) {
      const authReq = req.clone({
        headers: req.headers.set("Authorization", `Bearer ${token}`),
      });
      return next(authReq);
    }
  }

  return next(req);
};
