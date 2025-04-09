import { animate, state, style, transition, trigger } from '@angular/animations';
import { UpperCasePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

interface Data {
  id: string;
  name: string;
}

@Component({
  selector: 'app-asset-cancel',
  standalone: true,
  imports: [UpperCasePipe],
  template: `
    <button (click)="onCancel()" (mouseenter)="onMouseEnter()" (mouseleave)="onMouseLeave()">
      <div [@hoverText]="animationState">
        {{ data.name | uppercase }}
      </div>

      <div [@hoverSvg]="animationState">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path fill="currentColor" d="m12 12.708l-5.246 5.246q-.14.14-.344.15t-.364-.15t-.16-.354t.16-.354L11.292 12L6.046 6.754q-.14-.14-.15-.344t.15-.364t.354-.16t.354.16L12 11.292l5.246-5.246q.14-.14.345-.15q.203-.01.363.15t.16.354t-.16.354L12.708 12l5.246 5.246q.14.14.15.345q.01.203-.15.363t-.354.16t-.354-.16z" />
        </svg>
      </div>
    </button>
  `,
  styleUrl: './asset-cancel.component.css',
  animations: [
    trigger('hoverText', [
      state('initial', style({ transform: 'translate(50%, -50%)', opacity: 1 })),
      state('hovered', style({ transform: 'translate(50%, -150%)', opacity: 0 })),
      transition('initial <=> hovered', animate('0.2s ease-in-out')),
    ]),
    trigger('hoverSvg', [
      state('initial', style({ transform: 'translate(50%, 100%)', opacity: 0 })),
      state('hovered', style({ transform: 'translate(50%, -50%)', opacity: 1 })),
      transition('initial <=> hovered', animate('0.2s ease-in-out')),
    ])
  ],
})
export class AssetCancelComponent {
  @Input() data!: Data;
  @Output() cancelEmitter: EventEmitter<string> = new EventEmitter();

  protected isHovering: boolean = false;
  animationState: 'initial' | 'hovered' = 'initial';

  onCancel() {
    this.cancelEmitter.emit(this.data.id);
  }

  onMouseEnter() {
    this.isHovering = true;
    this.animationState = 'hovered';
  }

  onMouseLeave() {
    this.isHovering = false;
    this.animationState = 'initial';
  }
}