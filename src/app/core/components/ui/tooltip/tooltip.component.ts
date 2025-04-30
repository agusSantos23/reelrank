import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input, HostBinding } from '@angular/core';

@Component({
  selector: 'app-tooltip',
  standalone: true,
  imports: [],
  template: `
    {{ text }}
  `,
  styles: [`
    :host {
      position: absolute; 
      min-width: 150px;
      min-height: 18px;
      display: block; 
      padding: 8px;
      border: 2px solid var(--white);
      border-radius: 5px;
      text-align: center;
      background-color: var(--black);
      opacity: .9;
      color: var(--white);
      font-size: 0.9em;
      z-index: 100;
    }
  `],
  animations: [
    trigger('fade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-in', style({ opacity: 0.8 })),
      ]),
      transition(':leave', [
        animate('200ms ease-out', style({ opacity: 0 })),
      ]),
    ]),
  ],
  host: {
    '[@fade]': '',
    '[style.top]': 'positionStyles.top',
    '[style.left]': 'positionStyles.left',
  },
})
export class TooltipComponent {
  @Input() text: string = '';
  @Input() positionStyles: any = {};
}