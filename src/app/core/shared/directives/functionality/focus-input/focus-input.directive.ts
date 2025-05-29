import { Directive, ElementRef, HostListener, AfterViewInit, inject, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appFocusInput]'
})
export class FocusInputDirective implements AfterViewInit{
  private el = inject(ElementRef);
  private renderer = inject(Renderer2); 

  private inputElement: HTMLInputElement | null = null;


  ngAfterViewInit(): void {
    this.inputElement = this.el.nativeElement.querySelector('input');
    if (!this.inputElement) {
      console.warn('The Appfocusinputonck directive needs an input element within its host.', this.el.nativeElement);
    }
  }

  @HostListener('click') 
  onClick(): void {
    if (this.inputElement) this.inputElement.focus();
  }

  @HostListener('mouseenter') 
  onMouseEnter(): void {
    this.renderer.setStyle(this.el.nativeElement, 'cursor', 'text');
  }

  @HostListener('mouseleave') 
  onMouseLeave(): void {
    this.renderer.setStyle(this.el.nativeElement, 'cursor', 'default');
  }
}
