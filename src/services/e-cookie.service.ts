import { Injectable, Inject, inject } from "@angular/core";
import { CookieService, CookieOptions } from "ngx-cookie-service";

@Injectable({
  providedIn: "root",
})
export class ECookieService {
  service = inject(CookieService);

  get(key: string): string {
    return this.service.get(key);
  }

  put(key: string, value: string, options?: CookieOptions): void {
    this.service.set(key, value, options);
  }

  putE(key: string, value: string, options?: CookieOptions): void {
    this.service.set(key, value, options);
  }

  remove(key: string): void {
    this.service.delete(key);
  }

  removeAll(): void {
    this.service.deleteAll();
  }

  check(key: string): boolean {
    return this.service.check(key);
  }
}
