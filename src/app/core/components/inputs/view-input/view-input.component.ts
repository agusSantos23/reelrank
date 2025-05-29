import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-view-input',
  imports: [],
  template: `
  @if(isView){
    <svg (click)="onClick()" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
      <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5">
        <path d="M5.45 16.92a10.8 10.8 0 0 1-2.55-3.71a1.85 1.85 0 0 1 0-1.46A10.6 10.6 0 0 1 6.62 7.1A9 9 0 0 1 12 5.48a8.8 8.8 0 0 1 4 .85m2.56 1.72a10.85 10.85 0 0 1 2.54 3.7a1.85 1.85 0 0 1 0 1.46a10.6 10.6 0 0 1-3.72 4.65A9 9 0 0 1 12 19.48a8.8 8.8 0 0 1-4-.85" />
        <path d="M8.71 13.65a3.3 3.3 0 0 1-.21-1.17a3.5 3.5 0 0 1 3.5-3.5c.4-.002.796.07 1.17.21m2.12 2.12c.14.374.212.77.21 1.17a3.5 3.5 0 0 1-3.5 3.5a3.3 3.3 0 0 1-1.17-.21M3 20L19 4" />
      </g>
    </svg>
  }@else {
    <svg (click)="onClick()" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
      <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5">
        <path d="M2.899 12.735a1.87 1.87 0 0 1 0-1.47c.808-1.92 2.1-3.535 3.716-4.647S10.103 4.945 12 5.004c1.897-.059 3.768.502 5.385 1.614s2.908 2.727 3.716 4.647a1.87 1.87 0 0 1 0 1.47c-.808 1.92-2.1 3.535-3.716 4.647S13.897 19.055 12 18.996c-1.897.059-3.768-.502-5.385-1.614S3.707 14.655 2.9 12.735" />
        <path d="M12 15.5a3.5 3.5 0 1 0 0-7a3.5 3.5 0 0 0 0 7" />
      </g>
    </svg>
  }
  `,
  styles: [`
    :host {
      display:flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
    }
  `]
})
export class ViewInputComponent {

  @Input() isView: boolean = false;
  @Output() stateView = new EventEmitter<boolean>();

  public onClick(): void {
    this.isView = !this.isView;
    this.stateView.emit(this.isView);
  }

}
