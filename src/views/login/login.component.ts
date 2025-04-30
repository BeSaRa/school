import { Component, inject } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { LoginResponse } from "../../models/login.model";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { CommonModule } from "@angular/common";
import { ConfigService } from "@/services/config.service";
import { UrlService } from "@/services/url.service";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: "./login.component.html",
  styles: [],
})
export class LoginComponent {
  private readonly http = inject(HttpClient);
  private readonly fb = inject(FormBuilder);
  private readonly urlService = inject(UrlService);
  private readonly router = inject(Router);

  loginForm!: FormGroup;
  errorMessage: string = "";
  isLoading: boolean = false;

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ["", [Validators.required]],
      password: ["", [Validators.required]],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.errorMessage = "Please fill in all fields";
      return;
    }

    this.errorMessage = "";
    this.isLoading = true;

    const { username, password } = this.loginForm.value;

    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    this.http
      .post<LoginResponse>(`${this.urlService.URLS.LOGIN}`, formData)
      .subscribe({
        next: (response) => {
          if (response.access_token) {
            localStorage.setItem("access_token", response.access_token);
            this.router.navigate(["/schools"]);
          } else {
            this.errorMessage = "Invalid response from server";
          }
          this.isLoading = false;
        },
        error: (error: HttpErrorResponse) => {
          console.error("Login error:", error);
          if (error.status === 401) {
            this.errorMessage = "Invalid username or password";
          } else if (error.status === 0) {
            this.errorMessage =
              "Unable to connect to server. Please check your connection.";
          } else {
            this.errorMessage =
              error.error?.detail || "An error occurred during login";
          }
          this.isLoading = false;
        },
      });
  }
}
