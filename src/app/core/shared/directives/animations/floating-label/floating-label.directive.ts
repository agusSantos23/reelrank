import { Directive, ElementRef, HostListener, Input, Renderer2, AfterViewInit, inject } from '@angular/core';

@Directive({
  selector: '[appFloatingLabel]'
})
export class FloatingLabelDirective implements AfterViewInit {
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);

  @Input('appFloatingLabel') labelId!: string;
  private labelElement: HTMLElement | null = null;
  private isFocused: any = false;


  ngAfterViewInit(): void {
    this.labelElement = this.el.nativeElement.parentElement.querySelector(`#${this.labelId}`);
    if (this.labelElement) this.checkInputValue();
    
  }

  @HostListener('focus') onFocus(): void {
    this.isFocused = true;
    this.animateLabel(true);
  }

  @HostListener('blur') onBlur(): void {
    this.isFocused = false;
    this.checkInputValue();
  }

  @HostListener('input') onInput(): void {
    this.checkInputValue();
  }

  private checkInputValue(): void {
    if (this.labelElement) {
      const hasValue = (this.el.nativeElement as HTMLInputElement).value.trim() !== '';
      this.animateLabel(this.isFocused || hasValue);
    }
  }

  private animateLabel(shouldFloat: boolean): void {
    if (this.labelElement) {
      this.renderer.removeClass(this.labelElement, shouldFloat ? 'label-float-down' : 'label-float-up');
      this.renderer.addClass(this.labelElement, shouldFloat ? 'label-float-up' : 'label-float-down');
    }
  }
}