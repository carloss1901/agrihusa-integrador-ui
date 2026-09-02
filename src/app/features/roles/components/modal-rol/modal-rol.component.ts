import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnInit
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import {
  MODULOS_SISTEMA_CONFIG,
  ModuloSistemaConfig
} from '../../../../core/constants/modulos-sistema.constant';
import {
  AccionPermiso,
  ModuloSistema,
  Permiso
} from '../../../../core/models/permiso.model';
import { AgrihusaButtonComponent } from '../../../../shared/components/agrihusa-button/agrihusa-button.component';
import {
  Rol,
  RolFormData
} from '../../models/rol.model';

type NombreControl = 'nombre' | 'descripcion';

@Component({
  selector: 'app-modal-rol',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AgrihusaButtonComponent
  ],
  templateUrl: './modal-rol.component.html',
  styleUrls: ['./modal-rol.component.scss']
})
export class ModalRolComponent implements OnInit {
  @Input() titleModal = '';
  @Input() data: Rol | null = null;

  readonly modulos = MODULOS_SISTEMA_CONFIG;
  readonly acciones = Object.values(AccionPermiso);

  readonly formulario = new FormGroup({
    nombre: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.maxLength(50)
      ]
    }),
    descripcion: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.maxLength(150)
      ]
    })
  });

  submitted = false;
  errorPermisos = false;

  private readonly permisosSeleccionados =
    new Map<ModuloSistema, Set<AccionPermiso>>();

  constructor(
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    if (!this.data) {
      return;
    }

    this.formulario.patchValue({
      nombre: this.data.nombre,
      descripcion: this.data.descripcion
    });

    this.data.permisos.forEach((permiso) => {
      this.permisosSeleccionados.set(
        permiso.modulo,
        new Set(permiso.acciones)
      );
    });
  }

  accionDisponible(
    modulo: ModuloSistemaConfig,
    accion: AccionPermiso
  ): boolean {
    return modulo.accionesDisponibles.includes(accion);
  }

  tienePermiso(
    modulo: ModuloSistema,
    accion: AccionPermiso
  ): boolean {
    return (
      this.permisosSeleccionados
        .get(modulo)
        ?.has(accion) ?? false
    );
  }

  onPermisoChange(
    modulo: ModuloSistema,
    accion: AccionPermiso,
    seleccionado: boolean
  ): void {
    const acciones =
      this.permisosSeleccionados.get(modulo) ??
      new Set<AccionPermiso>();

    if (seleccionado) {
      acciones.add(accion);
      this.permisosSeleccionados.set(
        modulo,
        acciones
      );
    } else {
      acciones.delete(accion);

      if (acciones.size === 0) {
        this.permisosSeleccionados.delete(modulo);
      }
    }

    this.errorPermisos =
      this.permisosSeleccionados.size === 0;
  }

  onGuardar(): void {
    this.submitted = true;
    this.formulario.markAllAsTouched();

    const permisos = this.obtenerPermisos();
    this.errorPermisos = permisos.length === 0;

    if (
      this.formulario.invalid ||
      this.errorPermisos
    ) {
      return;
    }

    const value = this.formulario.getRawValue();

    const resultado: RolFormData = {
      nombre: value.nombre,
      descripcion: value.descripcion,
      permisos
    };

    this.activeModal.close(resultado);
  }

  onCerrarModal(): void {
    this.activeModal.dismiss();
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

  private obtenerPermisos(): Permiso[] {
    return Array.from(
      this.permisosSeleccionados.entries()
    ).map(([modulo, acciones]) => ({
      modulo,
      acciones: Array.from(acciones)
    }));
  }
}