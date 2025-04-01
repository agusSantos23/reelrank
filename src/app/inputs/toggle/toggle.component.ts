import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { ToggleKey } from '../models/toggleKey.model';


@Component({
  selector: 'app-toggle',
  imports: [UpperCasePipe],
  template: `
  <div class="card" [class.active]="value" (click)="toggle()">

    <div class="card-body" >
      
      <span>{{ data.key | uppercase }}</span>
      
    </div>
    
  </div>
  `,
  styleUrl: './toggle.component.css'
})
export class ToggleComponent {
  @Input() data: ToggleKey = { key: 'Error', value: false };
  @Input() value: boolean = false;
  @Output() valueChange = new EventEmitter<ToggleKey>();

  toggle() {
    this.value = !this.value;

    if(this.data) this.valueChange.emit({ ...this.data, value: this.value });

  }
}
