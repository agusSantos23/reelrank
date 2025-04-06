import { UpperCasePipe } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-title-page',
  imports: [UpperCasePipe],
  template: `
    <div>
      <h1>REELRANK</h1>
      <h2>{{ section | uppercase }}</h2>
    </div>


  `,
  styles: [`
    div {
      display: flex;
      justify-content: center;
      align-items: end;
    }

    h1 {
      width: 182px;
      margin: 0;
      font-size: 2em;
      font-weight: 900;
      color: var(--black);
      text-align: center;
    }

    h2 {
      margin: 0;
      margin-bottom: .16em;
      font-size: 1.2em;

      font-weight: 800;
      color: var(--black);
    }
  `]
})
export class TitlePageComponent {
  @Input() section: string = 'undefined';
}
