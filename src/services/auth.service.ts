import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, tap } from "rxjs";
import { LoginRequest, LoginResponse } from "../models/login.model";
import { ECookieService } from "./e-cookie.service";
import { ConfigService } from "@/services/config.service";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private token: string | undefined;

  constructor(
    private http: HttpClient,
    private eCookieService: ECookieService,
    private config: ConfigService
  ) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.config.BASE_URL}/auth/login`, credentials)
      .pipe(
        tap((response) => {
          this.setToken(response.access_token);
        })
      );
  }

  logout(): void {
    this.setToken(undefined);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | undefined {
    if (!this.token) {
      this.token = this.eCookieService.get("access_token");
    }
    return this.token;
  }

  private setToken(token: string | undefined): void {
    this.token = token;
    if (token) {
      this.eCookieService.putE("access_token", token);
    } else {
      this.eCookieService.remove("access_token");
    }
  }
}
