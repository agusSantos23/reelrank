import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-btn-icon',
  imports: [],
  template: `
  <button [style.width.px]="size" [style.height.px]="size" (click)="handleClick()">
    <div [style.width.px]="sizeContent" [style.height.px]="sizeContent">
      <ng-content></ng-content>
    </div>
  </button>
  `,
  styleUrl: './btn-icon.component.css'
})
export class BtnIconComponent implements OnInit {
  @Input() size: number = 40;
  @Output() clicked: EventEmitter<void> = new EventEmitter<void>();

  protected sizeContent!: number;

  ngOnInit(): void {
    this.sizeContent = this.size - 10;
  }

  handleClick() {
    this.clicked.emit();
  }
}
