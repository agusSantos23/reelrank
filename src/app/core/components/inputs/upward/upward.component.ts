import { animate, style, transition, trigger } from '@angular/animations';
import { Component, HostListener, Input } from '@angular/core';

@Component({
  selector: 'app-upward',
  imports: [],
  template: `
    @if(showButton){
      <button @enterLeave (click)="scrollToTop()">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
            <path fill="currentColor" d="m11.5 7.416l-3.746 3.746q-.14.14-.344.15t-.364-.15t-.16-.354t.16-.354l4.389-4.388q.242-.243.565-.243t.566.243l4.388 4.388q.14.14.15.344t-.15.364t-.354.16t-.354-.16L12.5 7.416v9.392q0 .213-.143.357t-.357.143t-.357-.144t-.143-.356z" />
          </svg>
        </div>
      </button>
    }
  `,
  styleUrl: './upward.component.css',
  animations:[
    trigger('enterLeave', [
      transition(':enter', [
        style({transform: 'translateX(120px)'}),
        animate('.3s ease-in', style({transform: 'translateX(0)'}))
      ]),
      transition(':leave', [
        style({transform: 'translateX(0)'}),
        animate('.3s ease-in', style({transform: 'translateX(120px)'}))
      ]),
    ])
  ]
})
export class UpwardComponent {
  @Input() scrollOffset: number = 500;

  public showButton: boolean = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {   
    
    this.showButton = window.scrollY > this.scrollOffset
  }

  public scrollToTop() {
    window.scrollTo(0, 0);

  }
}
