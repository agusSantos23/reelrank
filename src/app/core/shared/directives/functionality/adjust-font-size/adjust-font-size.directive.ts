import { Directive, ElementRef, Input, AfterViewInit, Renderer2, OnChanges, SimpleChanges, inject } from '@angular/core';

@Directive({
  selector: '[appAdjustFontSize]',
  standalone: true
})
export class AdjustFontSizeDirective implements AfterViewInit, OnChanges {
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);

  @Input('appAdjustFontSize') text?: string;
  @Input() longTextThreshold: number = 700;
  @Input() mediumTextThreshold: number = 400;
  @Input() longTextSize: string = '0.8em';
  @Input() mediumTextSize: string = '0.9em';
  @Input() defaultTextSize: string = '1.2em';

  ngAfterViewInit(): void {
    this.adjustFontSize();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['text']) {
      this.adjustFontSize();
    }
  }

  private adjustFontSize(): void {
    if (!this.text) return;

    const textLength = this.text.trim().length;

    if (textLength > this.longTextThreshold) {
      this.renderer.setStyle(this.el.nativeElement, 'font-size', this.longTextSize);
    } else if (textLength > this.mediumTextThreshold) {
      this.renderer.setStyle(this.el.nativeElement, 'font-size', this.mediumTextSize);
    } else {
      this.renderer.setStyle(this.el.nativeElement, 'font-size', this.defaultTextSize);
    }
  }
}