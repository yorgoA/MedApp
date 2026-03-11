import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h1>MedApp</h1>
        <p class="subtitle">Remote Patient Monitoring</p>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="login-form">
          <div class="form-group">
            <label for="email">Email</label>
            <input id="email" type="email" formControlName="email" placeholder="Email" />
            @if (form.get('email')?.invalid && form.get('email')?.touched) {
              <span class="error">Email is required</span>
            }
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input id="password" type="password" formControlName="password" placeholder="Password" />
            @if (form.get('password')?.invalid && form.get('password')?.touched) {
              <span class="error">Password is required</span>
            }
          </div>
          @if (errorMessage) {
            <div class="error">{{ errorMessage }}</div>
          }
          <button type="submit" [disabled]="form.invalid || loading">Sign In</button>
        </form>

        <div class="demo-credentials">
          <p><strong>Demo credentials:</strong></p>
          <p>Doctor: yorgoDR&#64;hotmail.com / Test123!</p>
          <p>Patient: jennifer&#64;hotmail.com / Test123!</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    }
    .login-card {
      background: #fff;
      padding: 2.5rem;
      border-radius: 12px;
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
      width: 100%;
      max-width: 400px;
    }
    h1 {
      margin: 0 0 0.25rem 0;
      font-size: 1.75rem;
      color: #0f172a;
    }
    .subtitle {
      margin: 0 0 1.5rem 0;
      color: #64748b;
      font-size: 0.9rem;
    }
    .login-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }
    label {
      font-size: 0.875rem;
      font-weight: 500;
      color: #334155;
    }
    input {
      padding: 0.6rem 0.75rem;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-size: 1rem;
    }
    input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59,130,246,0.2);
    }
    .error {
      color: #dc2626;
      font-size: 0.8rem;
    }
    button {
      padding: 0.75rem;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      margin-top: 0.5rem;
    }
    button:hover:not(:disabled) {
      background: #2563eb;
    }
    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .demo-credentials {
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e2e8f0;
      font-size: 0.8rem;
      color: #64748b;
    }
  `]
})
export class LoginComponent {
  form: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.nonNullable.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.errorMessage = '';
    this.auth.login(this.form.getRawValue()).subscribe({
      next: (res) => {
        this.loading = false;
        if (res) {
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = 'Invalid email or password';
        }
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Invalid email or password';
      }
    });
  }
}
