import { trigger, transition, style, animate, state } from '@angular/animations';

export const lowerScaleAnimation = trigger('lowerScale', [
  state('normal', style({ transform: 'scale(1)' })),
  state('clicked', style({ transform: 'scale(0.6)' })),
  transition('normal <=> clicked', animate('200ms ease-in-out'))
]);