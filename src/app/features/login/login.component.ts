import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {
  finalize,
  from,
  map,
  of,
  switchMap
} from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
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

  constructor(
    private loginControllerService: LoginControllerService,
    private alertService: AlertService,
    private authService: AuthService
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
      .pipe(
        switchMap((response) => {
          const contenido: unknown = response;

          if (!(contenido instanceof Blob)) {
            return of(response);
          }

          return from(contenido.text()).pipe(
            map(
              (texto) =>
                JSON.parse(texto) as MessageResponse
            )
          );
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: (respuesta: MessageResponse) => {
          if (respuesta.success === true) {
            const token = typeof respuesta.data === 'string'
              ? respuesta.data.trim()
              : '';

            if (!token || token.split('.').length !== 3) {
              this.errorMessage =
                'El servidor no devolvió un token válido.';

              this.alertService.error(this.errorMessage);
              return;
            }

            this.authService.establecerSesionBackend(
              token,
              nombreUsuario
            );

            this.alertService.success(
              respuesta.message ?? 'Inicio de sesión correcto.'
            );

            this.loginSuccess.emit();
            return;
          }

          this.alertService.error(
            respuesta.message ?? 'No se pudo iniciar sesión.'
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
}
