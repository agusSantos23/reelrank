import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Genre } from '../../../models/Genre.model';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-options-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './options-slider.component.html',
  styleUrl: './options-slider.component.css',
  animations: [
    trigger('slideAndGrow', [
      transition(':enter', [
        style({ transform: 'translateX(120%)', height: '0px' }),
        animate('.1s ease-in-out', style({ height: '40px' })),
        animate('1s .2s ease', style({ transform: 'translateX(0%)' })),
      ]),
      transition(':leave', [
        style({height: '40px' }),
        animate('.3s ease-out', style({ height: '0px' })),
      ])
    ])
  ]
})
export class OptionsSliderComponent {
  @Input() options?: Genre[];
  @Output() optionEmitter = new EventEmitter<Genre>();
  @ViewChild('container') container!: ElementRef;

  private isDragging: boolean = false;
  private startX: number = 0;
  private scrollLeft: number = 0;
  private hasMoved: boolean = false;


  selectedOption(option: Genre): void {
    if (!this.hasMoved) this.optionEmitter.emit(option);
    this.hasMoved = false;

  }

  onMouseDown(e: MouseEvent): void {
    this.isDragging = true;
    this.hasMoved = false;
    this.startX = e.pageX - this.container.nativeElement.offsetLeft;
    this.scrollLeft = this.container.nativeElement.scrollLeft;
    this.container.nativeElement.style.cursor = 'grabbing';
  }

  onMouseMove(e: MouseEvent): void {
    if (!this.isDragging) return;

    this.hasMoved = true;
    const walk = (e.pageX - this.container.nativeElement.offsetLeft - this.startX) * 1;
    this.container.nativeElement.scrollLeft = this.scrollLeft - walk;
  }

  onMouseUp(): void {
    this.isDragging = false;
    this.container.nativeElement.style.cursor = 'grab';

    setTimeout(() => {
      this.hasMoved = false;
    }, 200);
  }

  @HostListener('window:mouseup', ['$event'])
  onMouseUpWindow(event: MouseEvent): void {
    if (this.isDragging) {
      this.isDragging = false;

      if (this.container && this.container.nativeElement) {
        this.container.nativeElement.style.cursor = 'grab';

      }

      this.hasMoved = false;

    }
  }
}