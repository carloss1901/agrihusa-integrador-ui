import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { finalize } from 'rxjs';

import { MessageResponse } from '../../api/api/models/message-response';
import { LoginControllerService } from '../../api/api/services/login-controller.service';
import { AlertService } from '../../core/services/alert.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  @Output() readonly loginSuccess = new EventEmitter<void>();

  readonly formulario = new FormGroup({
    nombreUsuario: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    })
  });

  loading = false;
  submitted = false;
  errorMessage = '';
  mostrarPassword = false;
  readonly currentYear = new Date().getFullYear();

  constructor(
    private loginControllerService: LoginControllerService,
    private alertService: AlertService,
    private router: Router
  ) {}

  iniciarSesion(): void {
    this.submitted = true;
    this.errorMessage = '';
    this.formulario.markAllAsTouched();

    if (this.formulario.invalid || this.loading) {
      return;
    }

    const credentials = this.formulario.getRawValue();
    const nombreUsuario = credentials.nombreUsuario.trim();
    this.loading = true;

    this.loginControllerService
      .login({
        body: {
          usuario: nombreUsuario,
          contrasenia: credentials.password
        }
      })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (respuesta: MessageResponse) => {
          if (respuesta.success === true) {
            this.alertService.success(
              respuesta.message ?? 'Inicio de sesion correcto.'
            );

            const token = respuesta.data as unknown as string;
            if (token) {
              localStorage.setItem('token', token);
            }

            this.loginSuccess.emit();
            void this.router.navigate(['/inicio']);
            return;
          }

          this.alertService.error(
            respuesta.message ?? 'No se pudo iniciar sesion.'
          );
        },
        error: (error: HttpErrorResponse) => {
          const respuesta = error.error as MessageResponse;
          this.errorMessage = respuesta?.message ?? 'Error al iniciar sesion.';
          this.alertService.error(this.errorMessage);
        }
      });
  }

  controlInvalido(
    controlName: 'nombreUsuario' | 'password'
  ): boolean {
    const control = this.formulario.controls[controlName];
    return control.invalid && (control.touched || this.submitted);
  }

  alternarVisibilidadPassword(): void {
    this.mostrarPassword = !this.mostrarPassword;
  }
}
