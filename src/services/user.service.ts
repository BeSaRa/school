import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, catchError, throwError } from "rxjs";
import { User } from "../types/user.types";
import { UrlService } from "./url.service";
import { DialogService } from "./dialog.service";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly urlService = inject(UrlService);
  private readonly dialogService = inject(DialogService);
  getUrlSegment(): string {
    return this.urlService.URLS.USERS;
  }
  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.getUrlSegment()}me`).pipe(
      catchError((error) => {
        this.dialogService.error("Error fetching user", error).subscribe();
        return throwError(() => error);
      })
    );
  }
}
