import {
  ApplicationConfig,
  provideExperimentalZonelessChangeDetection,
} from "@angular/core";
import { provideRouter } from "@angular/router";
import { routes } from "@/routes/app.routes";
import { provideInterceptors } from "cast-response";
import { GeneralInterceptor } from "@/model-interceptors/general-interceptor";
import configInit from "../inits/config.init";
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from "@angular/common/http";
import { provideClientHydration } from "@angular/platform-browser";
import { authInterceptor } from "@/http-interceptors/auth.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    configInit,
    provideExperimentalZonelessChangeDetection(),
    provideClientHydration(),
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    provideInterceptors([GeneralInterceptor]),
  ],
};
