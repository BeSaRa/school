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
import { UrlService } from "@/services/url.service";
import { DialogService } from "../../app/services/dialog.service";

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
  private readonly dialogService = inject(DialogService);
  private readonly router = inject(Router);

  loginForm!: FormGroup;
  isLoading: boolean = false;

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ["", [Validators.required]],
      password: ["", [Validators.required]],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.dialogService
        .error("Validation Error", "Please fill in all fields")
        .subscribe();
      return;
    }

    this.isLoading = true;
    const { username, password } = this.loginForm.value;

    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    this.http
      .post<LoginResponse>(`${this.urlService.URLS.LOGIN}`, formData)
      .subscribe({
        next: (response) => {
          this.isLoading = false;

          if (response.access_token) {
            localStorage.setItem("access_token", response.access_token);
            this.router.navigate(["/chat-assistant"]);
          } else {
            this.dialogService
              .error("Login Failed", "Invalid response from server")
              .subscribe();
          }
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading = false;
          let title = "Login Error";
          let message = "An error occurred during login.";

          if (error.status === 401) {
            message = "Invalid username or password.";
          } else if (error.status === 0) {
            message =
              "Unable to connect to server. Please check your internet connection.";
          } else if (error.error?.detail) {
            message = error.error.detail;
          }

          this.dialogService.error(title, message).subscribe();
        },
      });
  }
}
