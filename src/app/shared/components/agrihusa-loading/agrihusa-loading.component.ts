import { Component, Input } from '@angular/core';

@Component({
  selector: 'agrihusa-loading',
  standalone: true,
  templateUrl: './agrihusa-loading.component.html',
  styleUrls: ['./agrihusa-loading.component.scss']
})
export class AgrihusaLoadingComponent {
  @Input() message: string | undefined =
    'Estamos cargando la informaci\u00f3n solicitada';
}
