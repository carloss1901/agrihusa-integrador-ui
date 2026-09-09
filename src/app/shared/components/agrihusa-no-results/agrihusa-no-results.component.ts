import { Component, Input } from '@angular/core';

@Component({
  selector: 'agrihusa-no-results',
  standalone: true,
  templateUrl: './agrihusa-no-results.component.html'
})
export class AgrihusaNoResultsComponent {
  @Input() message = 'No se encontraron resultados!';
}
