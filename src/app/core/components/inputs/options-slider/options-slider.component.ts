import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-options-slider',
  imports: [],
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
  @Input({required: true}) options?: any[];
  @Input() isImages: Boolean = false;
  @Output() optionEmitter = new EventEmitter<any>();
  @ViewChild('container') container!: ElementRef;

  public isDragging: boolean = false;
  public startX: number = 0;
  public scrollLeft: number = 0;
  public hasMoved: boolean = false;


  public selectedOption(option: any): void {
    if (!this.hasMoved) this.optionEmitter.emit(option);
    this.hasMoved = false;
  }

  public onMouseDown(e: MouseEvent): void {
    this.isDragging = true;
    this.hasMoved = false;
    this.startX = e.pageX - this.container.nativeElement.offsetLeft;
    this.scrollLeft = this.container.nativeElement.scrollLeft;
    this.container.nativeElement.style.cursor = 'grabbing';
  }

  public onMouseMove(e: MouseEvent): void {
    if (!this.isDragging) return;

    this.hasMoved = true;
    const walk = (e.pageX - this.container.nativeElement.offsetLeft - this.startX) * 1;
    this.container.nativeElement.scrollLeft = this.scrollLeft - walk;
  }

  public onMouseUp(): void {
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