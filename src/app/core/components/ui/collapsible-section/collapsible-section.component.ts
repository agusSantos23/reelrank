import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-collapsible-section',
  imports: [],
  template: `
    <header>

      <span id="collapsible-header" (click)="toggleCollapse()">
        <svg id="arrow" [class.collapsed]="!isCollapsed" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
          <path fill="var(--black)" d="M14 17.308L8.692 12L14 6.692l.708.708l-4.6 4.6l4.6 4.6z"/>
        </svg>

        <h3>{{ title }}</h3>
      </span>
      
    </header>

    @if(isCollapsed){
      <div @slideInOut id="collapsible-content" [class.collapsed]="!isCollapsed">
        <ng-content></ng-content>
      </div>
    }
  `,
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ height: '0px'}),
        animate('0.3s ease-in-out', style({ height: '*' }))
      ]),
      transition(':leave', [
        style({ height: '*'}),
        animate('0.3s ease-in-out', style({ height: '0px' }))
      ])
    ])
  ],
  styleUrl: './collapsible-section.component.css'
})
export class CollapsibleSectionComponent {

  @Input() title: string = 'TITLE';

  protected isCollapsed = true;

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

}
