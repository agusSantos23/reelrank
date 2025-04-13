import { animate, state, style, transition, trigger } from '@angular/animations';
import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-info-input',
  imports: [NgClass],
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
export class InfoInputComponent {

  @Input({required: true}) annotationsText: string[] = [];
  @Input() isRequired: boolean = false;

  protected onInfo: Boolean = false;
}
