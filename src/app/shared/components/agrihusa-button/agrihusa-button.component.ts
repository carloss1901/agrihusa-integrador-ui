import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

type IColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'light'
  | 'dark';

type IVariant = 'flat' | 'outlined';

type ISize = 'small' | 'medium' | 'large';

@Component({
  selector: 'agrihusa-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './agrihusa-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgrihusaButtonComponent {
  @Input() texto = 'Aceptar';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() loadingTexto = 'Guardado...';
  @Input() esIcono = false;
  @Input() icon = 'save';
  @Input() color: IColor = 'primary';
  @Input() variant: IVariant = 'flat';
  @Input() size: ISize = 'medium';
  @Input() classes = '';
  @Input() block = false;

  @HostBinding('style.pointer-events')
  get pEvents(): string {
    return this.disabled ? 'none' : 'auto';
  }

  @HostBinding('style.display')
  get pDisplay(): string {
    return this.block ? 'block' : 'inline-block';
  }

  getClasses(): string {
    const classes = ['btn'];

    const classVariant = this.getClassVariantColor(this.variant);
    if (classVariant) classes.push(classVariant);

    const classSize = this.getClassSize(this.size);
    if (classSize) classes.push(classSize);

    if (this.esIcono) classes.push('btn-icon');

    if (this.block) classes.push('w-100 d-flex');

    if (this.classes.trim().length > 0) classes.push(this.classes);

    return classes.join(' ');
  }

  private getClassVariantColor(variant: IVariant): string {
    if (variant === 'outlined') {
      return `btn-outline-${this.color}`;
    }
    return `btn-${this.color}`;
  }

  private getClassSize(size: ISize): string {
    switch (size) {
      case 'small':
        return 'btn-sm';
      case 'large':
        return 'btn-lg';
      default:
        return '';
    }
  }

  get localTexto(): string {
    if (this.esIcono) return '';
    return this.texto;
  }

  get isDisabled(): boolean {
    return this.loading || this.disabled;
  }

  get isIcon(): boolean {
    return typeof this.icon === 'string' && this.icon.trim().length > 0;
  }
}
