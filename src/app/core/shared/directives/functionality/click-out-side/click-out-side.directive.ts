import { Directive, ElementRef, HostListener, inject, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appClickOutSide]'
})
export class ClickOutSideDirective {
  private elementRef = inject(ElementRef);

  @Output() clickOutside = new EventEmitter<void>(); 

  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement: EventTarget): void {
    const clickedInside = this.elementRef.nativeElement.contains(targetElement as Node);
    
    if (!clickedInside) {
      this.clickOutside.emit();
    }
  }
}