import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.services';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
  standalone: true
})

export class Login implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string | null = null;
  cargando = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    this.errorMessage = null;
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.errorMessage = 'Por favor, ingrese un email válido y su contraseña.';
      return;
    }

    this.cargando = true;

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.router.navigate(['/inicio']);
      },
      error: (err: HttpErrorResponse) => {
        this.cargando = false;

        if (err.status === 401) {
          this.errorMessage = err.error?.message ?? 'Credenciales inválidas. Verifique su email y contraseña.';
        } else if (err.status === 0) {
          this.errorMessage = 'No se pudo conectar con el servidor. Intente nuevamente en unos minutos.';
        } else {
          this.errorMessage = 'Ocurrió un error inesperado. Intente nuevamente.';
        }
      }
    });
  }
}
