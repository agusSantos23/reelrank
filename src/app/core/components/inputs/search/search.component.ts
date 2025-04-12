import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-search',
  imports: [],
  template: `
    <div  id="container" (click)="onFocus()">
      <div id="background" [@backgroundFocus]="isInputFocused ? 'active':'inactive'"></div>
      <div id="content">
        <input type="text" placeholder="Search movies..." #searchInput (keyup.enter)="search(searchInput.value)" (focus)="onFocus()" (blur)="onBlur()"/>
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" (click)="search(searchInput.value)">
          <path fill="currentColor" d="M9.539 15.23q-2.398 0-4.065-1.666Q3.808 11.899 3.808 9.5t1.666-4.065T9.539 3.77t4.064 1.666T15.269 9.5q0 1.042-.369 2.017t-.97 1.668l5.909 5.907q.14.14.15.345q.009.203-.15.363q-.16.16-.354.16t-.354-.16l-5.908-5.908q-.75.639-1.725.989t-1.96.35m0-1q1.99 0 3.361-1.37q1.37-1.37 1.37-3.361T12.9 6.14T9.54 4.77q-1.991 0-3.361 1.37T4.808 9.5t1.37 3.36t3.36 1.37" />
        </svg>
      </div>
    </div>
  `,
  styleUrl: './search.component.css',
  animations: [
    trigger('backgroundFocus', [
      state('inactive', style({ opacity: 0 })),
      state('active', style({ opacity: 1 })),
      transition('inactive => active', animate('.2s ease')),
      transition('active => inactive', animate('.2s ease')),
    ])
  ]
})
export class SearchComponent {
  @Output() searchSubmitted = new EventEmitter<string>();
  @ViewChild('searchInput') searchInput: ElementRef | undefined;
  isInputFocused: boolean = false;


  search(term: string){
    this.searchSubmitted.emit(term)
    if (this.searchInput) {
      this.searchInput.nativeElement.blur();
    }
  }

  onFocus() {
    this.isInputFocused = true;
    if (this.searchInput) {
      this.searchInput.nativeElement.focus();
    }     
  }

  onBlur() {
    this.isInputFocused = false;
  }
}
