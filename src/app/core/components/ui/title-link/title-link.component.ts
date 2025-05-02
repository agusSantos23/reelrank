import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UpperCasePipe } from '@angular/common';


export interface DataLink{
  name: string;
  link: string;
}

@Component({
  selector: 'app-title-link',
  imports: [UpperCasePipe],
  template: `
    <header>
      <span [style.width.px]="220 + (namePage.length * 15)">
        <h1>REELRANK</h1>
        <h2>{{ namePage | uppercase }}</h2>
      </span>
      
      @if (dataLink) {
        <div>
          <h3 (click)="onGoTo()">GO {{ dataLink.name | uppercase }}</h3>
        </div>
      }
    </header>
  `,
  styleUrl: './title-link.component.css'
})
export class TitleLinkComponent {
  private router = inject(Router);

  @Input() namePage: string = 'none';
  @Input() dataLink?: DataLink;


  protected onGoTo(): void{
    if (this.dataLink) this.router.navigate([this.dataLink.link])
  }
}
