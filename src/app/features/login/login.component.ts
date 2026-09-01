import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { finalize } from 'rxjs';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent { 

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

  constructor(private authService: AuthService) { }

  iniciarSesion(): void {
    this.submitted = true;
    this.errorMessage = '';
    this.formulario.markAllAsTouched();

    if (this.formulario.invalid || this.loading) {
      return;
    }

    const credentials = this.formulario.getRawValue();

    this.loading = true;

    this.authService
      .login({
        nombreUsuario:
          credentials.nombreUsuario.trim(),
        password: credentials.password
      })
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe((resultado) => {
        if (!resultado.success) {
          this.errorMessage = resultado.message;
          return;
        }       
      });
  }

  controlInvalido(
    controlName: 'nombreUsuario' | 'password'
  ): boolean {
    const control =
      this.formulario.controls[controlName];

    return (
      control.invalid &&
      (control.touched || this.submitted)
    );
  }
}