import { Component, inject, Input } from '@angular/core';
import { WrapperComponent } from "../wrapper/wrapper.component";
import { Router } from '@angular/router';
import { UpperCasePipe } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-go-page',
  imports: [WrapperComponent, UpperCasePipe],
  template: `
    <div [@hoverMove]="hoverState">
      <app-wrapper
        (mouseenter)="hoverState = 'hovered'"
        (mouseleave)="hoverState = 'default'"
        type="btn"
        width="120px" 
        [contentPading]="[8, 2]" 
        cursor="po" 
        (wrapperClick)="goRoute($event)" 
        [contentText]="[800, '2px', undefined, '1rem']"
        [flex]="['start', '0']"> 
        
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
          <path fill="currentColor" d="m2.82 12l7.715 7.716q.22.22.218.528t-.224.529t-.529.221t-.529-.221L1.83 13.137q-.242-.243-.354-.54q-.111-.299-.111-.597t.111-.596q.112-.298.354-.54L9.47 3.22q.221-.221.532-.218q.31.003.532.224q.22.221.22.529t-.22.529z" />
        </svg>
        <span>
          {{ label | uppercase }}
        </span>
      </app-wrapper>
    </div>
  `,
  styleUrl: './go-page.component.css',
  animations: [
    trigger('hoverMove', [
      state('default', style({
        transform: 'translateX(0)'
      })),
      state('hovered', style({
        transform: 'translateX(-10px)'
      })),
      transition('default <=> hovered', animate('200ms ease-in-out')),
    ])
  ]
})
export class GoPageComponent {
  private route = inject(Router)

  @Input() routeText: string = '';
  @Input() label: string = 'text';

  hoverState: 'default' | 'hovered' = 'default';

  goRoute(element: any) {

    this.route.navigate([this.routeText]);

  }

}
