import { HttpErrorResponse } from '@angular/common/http';
import { Directive, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject, finalize, takeUntil } from 'rxjs';

import { AlertService } from '../../../core/services/alert.service';
import { MessageResponse } from '../../../api/api/models/message-response';

@Directive()
export abstract class ModalCrudBase<T> implements OnDestroy {
  guardando = false;
  private readonly destroy$ = new Subject<void>();

  protected constructor(
    protected readonly activeModal: NgbActiveModal,
    private readonly alertService: AlertService
  ) {}

  protected ejecutarGuardado(
    request: Observable<MessageResponse>,
    resultado: T
  ): void {
    if (this.guardando) return;

    this.guardando = true;
    request.pipe(
      takeUntil(this.destroy$),
      finalize(() => { this.guardando = false; })
    ).subscribe({
      next: (response) => {
        this.alertService.success(response.message!);
        this.activeModal.close(resultado);
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.error((error.error as { message?: string }).message!);
      }
    });
  }

  protected cerrarModal(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.activeModal.dismiss();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
