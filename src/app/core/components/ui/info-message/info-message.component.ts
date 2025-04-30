import { Component, Input } from '@angular/core';
import { WrapperComponent } from "../wrapper/wrapper.component";

@Component({
  selector: 'app-info-message',
  imports: [WrapperComponent],
  templateUrl: './info-message.component.html',
  styleUrl: './info-message.component.css'
})
export class InfoMessageComponent {
  @Input({required: true}) text: string = 'Message';
  @Input() code?: number;



}
