import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { Subject, finalize, takeUntil } from 'rxjs';

import { AgrihusaButtonComponent } from '../../../../shared/components/agrihusa-button/agrihusa-button.component';
import { AlertService } from '../../../../core/services/alert.service';
import { VariedadService } from '../../../../core/services/variedad.service';
import { Producto } from '../../../../core/models/producto.model';
import {
  Variedad,
  VariedadFormData
} from '../../../../core/models/variedad.model';

type NombreControl =
  | 'productoId'
  | 'nombre';

@Component({
  selector: 'app-modal-upsert-variedad',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule,
    AgrihusaButtonComponent
  ],
  templateUrl:
    './modal-upsert-variedad.component.html',
  styleUrls: [
    './modal-upsert-variedad.component.scss'
  ]
})
export class ModalUpsertVariedadComponent
  implements OnInit, OnDestroy {
  @Input() titleModal = '';
  @Input() data: Variedad | null = null;
  @Input() productos: Producto[] = [];
  submitted = false;
  guardando = false;
  private readonly destroy$ = new Subject<void>();

  readonly formulario = new FormGroup({
    productoId: new FormControl<number | null>(
      null,
      {
        validators: [Validators.required]
      }
    ),
    nombre: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.maxLength(100),
        Validators.pattern(
          /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9\s.'()-]+$/
        )
      ]
    })
  });

  constructor(
    public activeModal: NgbActiveModal,
    private readonly variedadService: VariedadService,
    private readonly alertService: AlertService
  ) {}

  ngOnInit(): void {
    if (!this.data) {
      return;
    }

    this.formulario.patchValue({
      productoId: this.data.productoId,
      nombre: this.data.nombre
    });
  }

  onGuardar(): void {
    this.submitted = true;
    this.formulario.markAllAsTouched();

    if (this.formulario.invalid) {
      return;
    }

    const value = this.formulario.getRawValue();

    if (value.productoId === null) {
      return;
    }

    const resultado: VariedadFormData = {
      productoId: value.productoId,
      nombre: value.nombre.trim()
    };

    if (this.guardando) {
      return;
    }

    this.guardando = true;
    const operacion = this.data
      ? this.variedadService.actualizar(this.data.id, resultado)
      : this.variedadService.crear(resultado);

    operacion
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.guardando = false;
        })
      )
      .subscribe({
        next: (response) => {
          this.alertService.success(response.message!);
          this.activeModal.close(true);
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.error(
            (error.error as { message?: string }).message!
          );
        }
      });
  }

  onCerrarModal(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.activeModal.dismiss();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  controlInvalido(
    nombreControl: NombreControl
  ): boolean {
    const control =
      this.formulario.controls[nombreControl];

    return (
      control.invalid &&
      (control.touched || this.submitted)
    );
  }
}
