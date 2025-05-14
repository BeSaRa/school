import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, catchError, switchMap, tap, throwError, map } from "rxjs";
import { Router } from "@angular/router";
import { LoginResponse } from "@/types/login.types";
import { UrlService } from "./url.service";
import { UserService } from "./user.service";
import { DialogService } from "./dialog.service";

@Injectable({
  providedIn: "root",
})
export class LoginService {
  private readonly http = inject(HttpClient);
  private readonly urlService = inject(UrlService);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  private readonly dialogService = inject(DialogService);

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

          // Store the token
          localStorage.setItem("access_token", response.access_token);

          // Get current user and navigate to dashboard
          return this.userService.getCurrentUser().pipe(
            tap((user) => this.userService.updateCurrentUser(user)),
            tap(() => this.router.navigate(["/chat-assistant"])),
            map(() => undefined) // Convert Observable<User> to Observable<void>
          );
        }),
        catchError(this.handleLoginError.bind(this)) // Bind 'this' to maintain context
      );
  }

  /**
   * Handles login errors and shows appropriate messages
   * @param error The error that occurred during login
   * @returns An Observable with the error dialog
   */
  private handleLoginError(
    error: HttpErrorResponse | Error
  ): Observable<never> {
    let title = "Login Error";
    let message = "An error occurred during login.";

    if (error instanceof HttpErrorResponse) {
      if (error.status === 401) {
        message = "Invalid username or password.";
      } else if (error.status === 0) {
        message =
          "Unable to connect to server. Please check your internet connection.";
      } else if (error.error?.detail) {
        message = error.error.detail;
      }
    } else {
      message = error.message;
    }

    return this.dialogService
      .error(title, message)
      .pipe(switchMap(() => throwError(() => error)));
  }
}
