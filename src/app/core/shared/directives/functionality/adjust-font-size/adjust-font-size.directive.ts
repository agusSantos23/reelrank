import { Directive, ElementRef, Input, AfterViewInit, Renderer2, inject } from '@angular/core';

@Directive({
  selector: '[appAdjustFontSize]',
  standalone: true
})
export class AdjustFontSizeDirective implements AfterViewInit {
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);

  @Input('appAdjustFontSize') text?: string;
  @Input() longTextThreshold: number = 700;
  @Input() mediumTextThreshold: number = 400;
  @Input() longTextSize: string = '0.8em';
  @Input() mediumTextSize: string = '0.9em';
  @Input() defaultTextSize: string = '1.2em';

  ngAfterViewInit(): void {    
    if (!this.text) return 

    const TextLength = this.text.trim().length;
    
    if (TextLength > this.longTextThreshold) {
      this.renderer.setStyle(this.el.nativeElement, 'font-size', this.longTextSize);

    } else if (TextLength > this.mediumTextThreshold) {
      this.renderer.setStyle(this.el.nativeElement, 'font-size', this.mediumTextSize);

    } else {
      this.renderer.setStyle(this.el.nativeElement, 'font-size', this.defaultTextSize);
    }
  }
}