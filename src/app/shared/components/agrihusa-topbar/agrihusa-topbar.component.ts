import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'agrihusa-topbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './agrihusa-topbar.component.html',
  styleUrls: ['./agrihusa-topbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgrihusaTopBarComponent {
  @Input() titulo = '';
  @Input() subtitulo = '';
  @Input() conBoton = true;
  @Input() btnIcono = 'x';
  @Input() btnTexto = 'x';
  @Input() btnLink = 'x';
  @Input() asLink = true;
  @Input() isLocalRoute = false;
  @Input() toUrl = '';
  @Input() showCancel = true;
  @Output() click = new EventEmitter();
}
