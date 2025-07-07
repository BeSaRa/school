import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { LoadingService } from "@/services/loading.service";
import { finalize } from "rxjs";
import { SKIP_LOADING } from "../tokens/loading-context.token";

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  const skip = req.context.get(SKIP_LOADING);
  if (skip) {
    return next(req);
  }

  loadingService.startLoading();

  return next(req).pipe(
    finalize(() => {
      loadingService.stopLoading();
    })
  );
};
