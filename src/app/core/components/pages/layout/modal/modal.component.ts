import { Component, Input } from '@angular/core';

export interface Header {
  title: string;
  subtitle: string;
}

@Component({
  selector: 'app-modal',
  imports: [],
  template: `
  @if (isVisible) {
    <div id="modal-overlay">
      <div 
        id="modal-container" 
        [style.width]="width"
        [style.height]="height"
        [style.padding.px]="padding">
        
        @if (header) {
          <header>
            <svg (click)="closeModal()" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="currentColor" d="m12 12.708l-5.246 5.246q-.14.14-.344.15t-.364-.15t-.16-.354t.16-.354L11.292 12L6.046 6.754q-.14-.14-.15-.344t.15-.364t.354-.16t.354.16L12 11.292l5.246-5.246q.14-.14.345-.15q.203-.01.363.15t.16.354t-.16.354L12.708 12l5.246 5.246q.14.14.15.345q.01.203-.15.363t-.354.16t-.354-.16z" />
            </svg>
            <div>
              <h2>{{ header.title }}</h2>
              <h3>{{ header.subtitle }}</h3>
            </div>
          </header>
        }
        <ng-content></ng-content>
      </div>
    </div>
  }
`,
  styleUrl: './modal.component.css'
})
export class ModalComponent {
  @Input() width: string = 'auto';
  @Input() height: string = 'auto';
  @Input() padding: number = 10;
  @Input() header?: Header;
  @Input() isVisible: boolean = false;

  public openModal() {

    this.isVisible = true;
  }

  public closeModal() {

    this.isVisible = false;
  }
}
