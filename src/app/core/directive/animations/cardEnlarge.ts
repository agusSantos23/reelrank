import { animate, state, style, transition, trigger } from "@angular/animations";


export const cardEnlarge = trigger('zoom',[
  state('normal', style({ transform: 'scale(1)', borderRadius: '5px 5px 0 0' })),
  state('hovered', style({ transform: 'scale(.85)', borderRadius: '5px' })),
  transition('normal <=> hovered', animate('0.3s ease-in-out')),
]);