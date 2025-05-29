import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-info-input',
  imports: [],
  templateUrl: './info-input.component.html',
  styleUrl: './info-input.component.css',
  animations: [
    trigger('opacity', [
      state('in', style({ opacity: 1 })),
      state('out', style({ opacity: 0 })),
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-out', style({ opacity: 0 }))
      ])
    ])
  ],
})
export class InfoInputComponent implements OnInit {

  @Input() annotationsText: string[] = [];
  @Input() isRequired: boolean = false;
  @Input() isHalf: boolean = false;

  public onInfo: Boolean = false;

  ngOnInit(): void {
    
    if (this.annotationsText.length <= 0 && this.isRequired) this.annotationsText = ["Is required"];
    
  }
}
