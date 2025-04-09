import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Genre } from '../../../models/Genre';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-options-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './options-slider.component.html',
  styleUrl: './options-slider.component.css',
  animations:[
    trigger('enterLeave', [
      transition(':enter', [
        style({
          transform: 'translateX(-100%)', 
          opacity: 0,                                      
          'z-index': '-1'
        }),
        animate('2s ease-out', style({ 
          transform: 'translateX(0%)',   
          opacity: 1                                      
        }))
      ]),
      transition(':leave', [
        style({transform: 'translateY(0)'}),
        animate('.3s ease-in', style({transform: 'translateY(120px)'}))
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