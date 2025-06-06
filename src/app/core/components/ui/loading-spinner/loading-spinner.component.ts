import { animate, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  imports: [],
  template: `
  <div>
    <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24">
      <path d="m8.125 7.092l2.608-3.47q.238-.322.566-.472T12 3t.701.15t.566.471l2.608 3.471l4.02 1.368q.534.18.822.605q.289.426.289.94q0 .237-.07.471t-.228.449l-2.635 3.573l.1 3.83q.025.706-.466 1.189T16.564 20l-.454-.056L12 18.733l-4.11 1.211q-.124.05-.24.053q-.117.003-.214.003q-.665 0-1.15-.483t-.459-1.188l.1-3.856l-2.629-3.548q-.159-.217-.229-.453Q3 10.236 3 10q0-.506.297-.942q.296-.435.828-.618z" />
    </svg>
  </div>
  `,
  styleUrl: './loading-spinner.component.css',
  animations: [
    trigger('fade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-in-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('200ms ease-in-out', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class LoadingSpinnerComponent {
  
}
