import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, catchError, switchMap, tap, throwError, map } from "rxjs";
import { Router } from "@angular/router";
import { LoginResponse } from "@/types/login.types";
import { UrlService } from "./url.service";
import { UserService } from "./user.service";
import { DialogService } from "./dialog.service";
import { AppRoutes } from "@/constants/routes.constants";
import { LocalService } from "./local.service";

@Injectable({
  providedIn: "root",
})
export class LoginService {
  private readonly http = inject(HttpClient);
  private readonly urlService = inject(UrlService);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  private readonly dialogService = inject(DialogService);
  private readonly localService = inject(LocalService);

  /**
   * Authenticates a user with the provided credentials
   * @param username The username for authentication
   * @param password The password for authentication
   * @returns An Observable that completes when login is successful
   */
  login(username: string, password: string): Observable<void> {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    return this.http
      .post<LoginResponse>(this.urlService.URLS.LOGIN, formData)
      .pipe(
        switchMap((response) => {
          if (!response.access_token) {
            return throwError(() => new Error("Invalid server response"));
          }

          localStorage.setItem("access_token", response.access_token);
          return this.userService.getCurrentUser().pipe(
            tap((user) => this.userService.updateCurrentUser(user)),
            tap(() => this.router.navigateByUrl(AppRoutes.CHAT_ASSISTANT)),
            map(() => undefined) // Convert Observable<User> to Observable<void>
          );
        }),
        catchError((error) => {
          this.dialogService
            .error(this.localService.locals().error_login, error.message)
            .subscribe();
          return throwError(() => error);
        })
      );
  }
}
