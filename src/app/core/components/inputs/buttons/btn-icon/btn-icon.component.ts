import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-btn-icon',
  imports: [],
  template: `
  <button (click)="handleClick()">
    <div>
      <ng-content></ng-content>
    </div>
  </button>
  `,
  styleUrl: './btn-icon.component.css'
})
export class BtnIconComponent {
  @Output() clicked: EventEmitter<void> = new EventEmitter<void>();

  handleClick() {
    this.clicked.emit();
  }
}
