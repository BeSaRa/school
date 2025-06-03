import { Injectable, inject } from "@angular/core";
import { Observable, catchError, throwError, BehaviorSubject } from "rxjs";
import { DialogService } from "./dialog.service";
import { isPlatformBrowser } from "@angular/common";
import { PLATFORM_ID } from "@angular/core";
import { CastResponseContainer } from "cast-response";
import { BaseCrudService } from "@/abstracts/base-crud-service";
import { User } from "@/models/user";
import { LocalService } from "./local.service";

@CastResponseContainer({
  $default: {
    model: () => User,
  },
})
@Injectable({
  providedIn: "root",
})
export class UserService extends BaseCrudService<User> {
  override serviceName: string = "UserService";
  private readonly dialogService = inject(DialogService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly localService = inject(LocalService);

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    super();
    if (isPlatformBrowser(this.platformId)) {
      const storedUser = localStorage.getItem("current_user");
      if (storedUser) {
        try {
          this.currentUserSubject.next(JSON.parse(storedUser));
        } catch {
          localStorage.removeItem("current_user");
        }
      }
    }
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getUrlSegment(): string {
    return this.urlService.URLS.USERS;
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.getUrlSegment()}me`).pipe(
      catchError((error) => {
        this.dialogService
          .error(
            this.localService.locals().error_loading_profile,
            error.message
          )
          .subscribe();
        return throwError(() => error);
      })
    );
  }

  updateCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem("current_user", JSON.stringify(user));
    }
  }

  clearCurrentUser(): void {
    this.currentUserSubject.next(null);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem("current_user");
    }
  }
}
