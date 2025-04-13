import { trigger, transition, style, animate } from '@angular/animations';

export const cardArrivesAnimation = trigger('cardArrives', [
  transition(':enter', [
    style({ height: '0%' }),
    animate('1s {{delay}}ms ease-in', style({ height: '100%' }))
  ], { params: { delay: 0 } }), 
  transition(':leave', [
    style({ height: '100%' }),
    animate('1s ease-out', style({ height: '0%' }))
  ])
]);