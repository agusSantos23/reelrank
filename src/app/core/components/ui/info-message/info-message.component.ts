import { Component, Input } from '@angular/core';
import { WrapperComponent } from "../wrapper/wrapper.component";

@Component({
  selector: 'app-info-message',
  imports: [WrapperComponent],
  template: `
    <app-wrapper
    containerColor="g"
    width="350px">
      @if (code) {
        <span>{{ code }}</span>
      }
      <p>{{ text }}</p>
    </app-wrapper>
  `,
  styles: `
    span{
      color: var(--orange);
      font-size: 2.5rem;
      font-weight: 900;
      letter-spacing: 2px;
      opacity: .4;
    }

    p{
      font-weight: 600;
    }
  `
})
export class InfoMessageComponent {
  @Input({ required: true }) text: string = 'Message';
  @Input() code?: number;



}
