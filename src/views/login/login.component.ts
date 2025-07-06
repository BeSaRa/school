import { AfterViewInit, Component, ElementRef, inject, OnInit, signal, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { DialogService } from "../../services/dialog.service";
import { LoginService } from "../../services/login.service";
import { finalize } from "rxjs";
import { LocalService } from "@/services/local.service";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: "./login.component.html",
})
export class LoginComponent implements OnInit, AfterViewInit {
  @ViewChild("usernameInput") usernameInputRef!: ElementRef<HTMLInputElement>;
  // Injected services
  private readonly fb = inject(FormBuilder);
  private readonly dialogService = inject(DialogService);
  private readonly loginService = inject(LoginService);
  localService = inject(LocalService);

  // Component state
  loginForm!: FormGroup;
  isLoading = signal(false);

  ngOnInit() {
    this.initializeForm();
  }
  ngAfterViewInit(): void {
    this.usernameInputRef.nativeElement.focus();
  }

  /**
   * Initializes the login form with validators
   */
  private initializeForm(): void {
    this.loginForm = this.fb.group({
      username: ["", [Validators.required, Validators.minLength(3)]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    });
  }

  /**
   * Handles form submission
   */
  onSubmit(): void {
    // Validate form
    if (this.loginForm.invalid) {
      this.dialogService.error(this.localService.locals().error_validation, "Please fill in all fields correctly").subscribe();
      return;
    }

    // Set loading state
    this.isLoading.set(true);

    // Extract credentials
    const { username, password } = this.loginForm.value;

    // Call login service
    this.loginService
      .login(username, password)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe();
  }
}
