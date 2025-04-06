import { animate, state, style, transition, trigger } from "@angular/animations";


export const zoomAnimation = trigger('zoom',[
  state('normal', style({ transform: 'scale(1)' })),
  state('hovered', style({ transform: 'scale(.85)' })),
  transition('normal <=> hovered', animate('0.3s ease-in-out')),
]);