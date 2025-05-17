import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-collapsible-section',
  imports: [],
  template: `
  <div id="collapsible">
    <header>

      <span id="collapsible-header" (click)="toggleCollapse()">
        <svg id="arrow" [class.collapsed]="!isCollapsed" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
          <path fill="var(--black)" d="M14 17.308L8.692 12L14 6.692l.708.708l-4.6 4.6l4.6 4.6z"/>
        </svg>

        <h3>{{ title }}</h3>
      </span>
      
    </header>

    @if(isCollapsed){
      <div id="collapsible-content" [class.collapsed]="!isCollapsed">
        <ng-content></ng-content>
      </div>
    }

  </div>
  `,
  styleUrl: './collapsible-section.component.css'
})
export class CollapsibleSectionComponent {

  @Input() title: string = 'TITLE';

  protected isCollapsed = true;

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

}
