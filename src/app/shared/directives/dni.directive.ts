import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appSoloNumeros]',
  standalone: true
})
export class SoloNumerosDirective {
  @Input() appSoloNumeros: number | null = 8;

  constructor(private readonly elementRef: ElementRef<HTMLInputElement>) {}

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (this.appSoloNumeros === null) {
      return;
    }

    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
    const input = this.elementRef.nativeElement;

    if (allowedKeys.includes(event.key) || event.ctrlKey || event.metaKey) {
      return;
    }

    if (!/^\d$/.test(event.key)) {
      event.preventDefault();
      return;
    }

    const hasSelection = input.selectionStart !== input.selectionEnd;
    if (input.value.length >= this.appSoloNumeros && !hasSelection) {
      event.preventDefault();
    }
  }

  @HostListener('input')
  onInput(): void {
    if (this.appSoloNumeros === null) {
      return;
    }

    const input = this.elementRef.nativeElement;
    const sanitizedValue = input.value.replace(/\D/g, '').slice(0, this.appSoloNumeros);

    if (input.value !== sanitizedValue) {
      input.value = sanitizedValue;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
}
