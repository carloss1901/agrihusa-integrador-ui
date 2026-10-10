import {
  Directive,
  ElementRef,
  HostListener,
  Input
} from '@angular/core';

@Directive({
  selector: '[appSoloNumeros]',
  standalone: true
})
export class SoloNumerosDirective {
  @Input() appSoloNumeros: number | null = 8;

  constructor(
    private readonly elementRef: ElementRef<HTMLInputElement>
  ) {}

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (this.appSoloNumeros === null) {
      return;
    }

    const teclasPermitidas = [
      'Backspace',
      'Delete',
      'Tab',
      'Escape',
      'Enter',
      'ArrowLeft',
      'ArrowRight',
      'Home',
      'End'
    ];

    const input = this.elementRef.nativeElement;

    if (
      teclasPermitidas.includes(event.key) ||
      event.ctrlKey ||
      event.metaKey
    ) {
      return;
    }

    if (!/^\d$/.test(event.key)) {
      event.preventDefault();
      return;
    }

    const tieneSeleccion =
      input.selectionStart !== input.selectionEnd;

    if (
      input.value.length >= this.appSoloNumeros &&
      !tieneSeleccion
    ) {
      event.preventDefault();
    }
  }

  @HostListener('input')
  onInput(): void {
    if (this.appSoloNumeros === null) {
      return;
    }

    const input = this.elementRef.nativeElement;
    const valorLimpio = input.value
      .replace(/\D/g, '')
      .slice(0, this.appSoloNumeros);

    if (input.value !== valorLimpio) {
      input.value = valorLimpio;
      input.dispatchEvent(
        new Event('input', { bubbles: true })
      );
    }
  }
}