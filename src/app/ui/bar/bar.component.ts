import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-bar',
  imports: [],
  template: `<div [style.width]="width" [style.height]="height"></div>`,
  styles:  [`
    div {
      background-image: var(--gradient-first);
      border-radius: 5px;
    }
  `]
})
export class BarComponent {
  @Input() width: string = '100px';
  @Input() height: string = '10px';
}
