import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-bar',
  imports: [],
  template: `<div [style.width]="width" [style.height]="height ? height : dynamicHeight"></div>`,
  styles:  [`
    div {
      display: block;
      background-image: var(--gradient);
      border-radius: 5px;
    }
  `]
})
export class BarComponent implements OnInit, OnChanges{
  @Input() width: string = '100px';
  @Input() height?: string;
  @Input() text?: string;

  dynamicHeight: string = '60%'; 

  ngOnInit(): void {
    console.log(this.text);
    
    if (this.text) this.setDynamicHeight(this.text?.length);      
    
  }

  ngOnChanges(changes: SimpleChanges): void {
      
    if (changes['text']) {
      if (this.text) this.setDynamicHeight(this.text?.length);      
    }
  }

  setDynamicHeight(length: number): void {
    if (length > 600) {
      this.dynamicHeight = '100%';
    } else if (length > 400) {
      this.dynamicHeight = '90%';
    } else if (length > 300) {
      this.dynamicHeight = '80%';
    } else if (length > 200) {      
      this.dynamicHeight = '70%';
    } else {
      this.dynamicHeight = '60%'
    }

    console.log(this.dynamicHeight);
    
  }
}
