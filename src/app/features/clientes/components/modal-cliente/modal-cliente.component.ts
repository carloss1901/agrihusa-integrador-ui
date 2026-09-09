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
import { NgSelectModule } from '@ng-select/ng-select';

import { AgrihusaButtonComponent } from '../../../../shared/components/agrihusa-button/agrihusa-button.component';
import {
    Cliente,
    ClienteFormData,
    TipoDocumentoCliente
} from '../../models/cliente.model';

type NombreControl =
    | 'tipoDocumento'
    | 'numeroDocumento'
    | 'razonSocial'
    | 'nombreComercial'
    | 'contacto'
    | 'correo'
    | 'telefono'
    | 'direccion'
    | 'pais';

interface TipoDocumentoOption {
    valor: TipoDocumentoCliente;
    descripcion: string;
}

@Component({
    selector: 'app-modal-cliente',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NgSelectModule,
        AgrihusaButtonComponent
    ],
    templateUrl: './modal-cliente.component.html',
    styleUrls: ['./modal-cliente.component.scss']
})
export class ModalClienteComponent implements OnInit {
    @Input() titleModal = '';
    @Input() data: Cliente | null = null;

    submitted = false;

    readonly tiposDocumento: TipoDocumentoOption[] = [
        {
            valor: TipoDocumentoCliente.RUC,
            descripcion: 'RUC'
        },
        {
            valor: TipoDocumentoCliente.DNI,
            descripcion: 'DNI'
        },
        {
            valor: TipoDocumentoCliente.CARNET_EXTRANJERIA,
            descripcion: 'CARNET DE EXTRANJERÍA'
        },
        {
            valor: TipoDocumentoCliente.PASAPORTE,
            descripcion: 'PASAPORTE'
        },
        {
            valor: TipoDocumentoCliente.OTRO,
            descripcion: 'OTRO'
        }
    ];

    readonly formulario = new FormGroup({
        tipoDocumento:
            new FormControl<TipoDocumentoCliente | null>(
                null,
                {
                    validators: [Validators.required]
                }
            ),
        numeroDocumento: new FormControl('', {
            nonNullable: true,
            validators: [
                Validators.required,
                Validators.maxLength(20)
            ]
        }),
        razonSocial: new FormControl('', {
            nonNullable: true,
            validators: [
                Validators.required,
                Validators.maxLength(150)
            ]
        }),
        nombreComercial: new FormControl('', {
            nonNullable: true,
            validators: [Validators.maxLength(120)]
        }),
        contacto: new FormControl('', {
            nonNullable: true,
            validators: [Validators.maxLength(120)]
        }),
        correo: new FormControl('', {
            nonNullable: true,
            validators: [
                Validators.email,
                Validators.maxLength(120)
            ]
        }),
        telefono: new FormControl('', {
            nonNullable: true,
            validators: [
                Validators.maxLength(20),
                Validators.pattern(/^[0-9+\s()-]*$/)
            ]
        }),
        direccion: new FormControl('', {
            nonNullable: true,
            validators: [Validators.maxLength(200)]
        }),
        pais: new FormControl('PERÚ', {
            nonNullable: true,
            validators: [
                Validators.required,
                Validators.maxLength(80)
            ]
        })
    });

    constructor(
        public activeModal: NgbActiveModal
    ) { }

    ngOnInit(): void {
        this.formulario.controls.tipoDocumento
            .valueChanges
            .subscribe((tipoDocumento) => {
                this.actualizarValidadoresDocumento(
                    tipoDocumento
                );
            });

        if (this.data) {
            this.formulario.patchValue({
                tipoDocumento: this.data.tipoDocumento,
                numeroDocumento: this.data.numeroDocumento,
                razonSocial: this.data.razonSocial,
                nombreComercial:
                    this.data.nombreComercial,
                contacto: this.data.contacto,
                correo: this.data.correo,
                telefono: this.data.telefono,
                direccion: this.data.direccion,
                pais: this.data.pais
            });
        }

        this.actualizarValidadoresDocumento(
            this.formulario.controls.tipoDocumento.value
        );
    }

    get modoEdicion(): boolean {
        return this.data !== null;
    }

    onGuardar(): void {
        this.submitted = true;
        this.formulario.markAllAsTouched();

        if (this.formulario.invalid) {
            return;
        }

        const value = this.formulario.getRawValue();

        const resultado: ClienteFormData = {
            tipoDocumento:
                value.tipoDocumento as TipoDocumentoCliente,
            numeroDocumento: value.numeroDocumento.trim(),
            razonSocial: value.razonSocial.trim(),
            nombreComercial:
                value.nombreComercial.trim(),
            contacto: value.contacto.trim(),
            correo: value.correo.trim(),
            telefono: value.telefono.trim(),
            direccion: value.direccion.trim(),
            pais: value.pais.trim()
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

    private actualizarValidadoresDocumento(
        tipoDocumento: TipoDocumentoCliente | null
    ): void {
        const control =
            this.formulario.controls.numeroDocumento;

        const validadores = [
            Validators.required,
            Validators.maxLength(20)
        ];

        switch (tipoDocumento) {
            case TipoDocumentoCliente.RUC:
                validadores.push(
                    Validators.pattern(/^[0-9]{11}$/)
                );
                break;

            case TipoDocumentoCliente.DNI:
                validadores.push(
                    Validators.pattern(/^[0-9]{8}$/)
                );
                break;

            case TipoDocumentoCliente.CARNET_EXTRANJERIA:
                validadores.push(
                    Validators.pattern(/^[A-Za-z0-9]{9,12}$/)
                );
                break;

            case TipoDocumentoCliente.PASAPORTE:
                validadores.push(
                    Validators.pattern(/^[A-Za-z0-9]{6,12}$/)
                );
                break;

            default:
                validadores.push(
                    Validators.pattern(/^[A-Za-z0-9-]{3,20}$/)
                );
                break;
        }

        control.setValidators(validadores);
        control.updateValueAndValidity({
            emitEvent: false
        });
    }
}