import { Directive, ElementRef, HostListener, Input, ViewContainerRef, ComponentRef, EmbeddedViewRef, inject, SimpleChanges, OnChanges, } from '@angular/core';
import { TooltipComponent } from '../../../../components/ui/tooltip/tooltip.component';

@Directive({
  selector: '[appTooltipTrigger]',
  standalone: true
})
export class TooltipTriggerDirective implements OnChanges{
  private el = inject(ElementRef);
  private viewContainerRef = inject(ViewContainerRef);

  @Input('appTooltipTrigger') tooltipText: string = '';
  @Input() tooltipPosition: 'top' | 'bottom' | 'left' | 'right' = 'bottom';

  private tooltipComponentRef: ComponentRef<TooltipComponent> | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tooltipText'] && this.tooltipComponentRef) {
      this.tooltipComponentRef.instance.text = this.tooltipText;
    }
  }

  @HostListener('mouseenter') onMouseEnter(): void {
    if (!this.tooltipComponentRef) this.showTooltip();
    
  }

  @HostListener('mouseleave') onMouseLeave(): void {
    if (this.tooltipComponentRef) this.hideTooltip();
    
  }

  private showTooltip(): void {
    this.tooltipComponentRef = this.viewContainerRef.createComponent(TooltipComponent);
    
    this.tooltipComponentRef.instance.text = this.tooltipText;
    this.setPosition();
  }

  private hideTooltip(): void {
    if (this.tooltipComponentRef) {
      this.tooltipComponentRef.destroy();
      this.tooltipComponentRef = null;
    }
  }

  private setPosition(): void {
    if (!this.tooltipComponentRef) return console.warn("No tooltip component");
  
    const hostRect = this.el.nativeElement.getBoundingClientRect();
    
    const tooltipRect = (this.tooltipComponentRef.hostView as EmbeddedViewRef<any>).rootNodes[0].getBoundingClientRect();
    
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const scrollX = window.scrollX || document.documentElement.scrollLeft;
    
    let top: number, left: number;

    const spacing = 5; 

    switch (this.tooltipPosition) {
      case 'top':
        top = hostRect.top + scrollY - tooltipRect.height - spacing;
        left = hostRect.left + scrollX + (hostRect.width - tooltipRect.width) / 2;
        break;

      case 'left':
        top = hostRect.top + scrollY + (hostRect.height - tooltipRect.height) / 2;
        left = hostRect.left + scrollX - tooltipRect.width - spacing;
        break;

      case 'right':
        top = hostRect.top + scrollY + (hostRect.height - tooltipRect.height) / 2;
        left = hostRect.right + scrollX + spacing;
        break;

      //Bottom
      default:
        top = hostRect.bottom + scrollY + spacing;
        left = hostRect.left + scrollX + (hostRect.width - tooltipRect.width) / 2;
        break;
    }

    this.tooltipComponentRef.instance.positionStyles = {
      top: `${top}px`,
      left: `${left}px`
    };
    
  }
}