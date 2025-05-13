import { Component, EventEmitter, Input, Output, SimpleChanges, OnInit, OnChanges } from '@angular/core';
import { WrapperComponent } from "../../../ui/wrapper/wrapper.component";

@Component({
  selector: 'app-slider-rating',
  imports: [WrapperComponent],
  template: `
    <div>
    
      @if (showZero) {
        <span>0</span>
      }

      <input
        type="range"
        [min]="min"
        [max]="max"
        [value]="internalCurrentValue"
        [step]="step"
        [disabled]="isDisable"
        [style.cursor]="isDisable ? 'not-allowed' : 'pointer'"
        (input)="onSliderInput($any($event.target).value)"
        (mouseup)="onSliderMouseUp()"
        [style.marginRight]="isViewWindow ? '10px' : undefined"
        [style.marginLeft]="isViewWindow ? '10px' : undefined">

      @if(isViewWindow){
        <app-wrapper width="40px" [contentPading]="[5,2]" [containerPading]="3">
          {{ hasInteracted ? internalCurrentValue : '-' }}
        </app-wrapper>
      }
    </div>
  `,
  styleUrl: './slider-rating.component.css'
})
export class SliderRatingComponent implements OnInit, OnChanges {
  @Input() max: number = 10;
  @Input() min: number = 0;
  @Input() externalRating?: number;
  @Input() isViewWindow: boolean = true;
  @Input() isDisable: boolean = false; 
  @Input() showZero: boolean = false;

  @Output() ratingChange = new EventEmitter<number>();

  protected currentValue: number = 0;
  protected internalCurrentValue?: number; 
  protected step: number = 1;
  private isDragging: boolean = false;
  protected hasInteracted: boolean = true;


  ngOnInit(): void {

    this.ensureMaxRange();
    this.setExternalValue(this.externalRating);
    this.internalCurrentValue = this.currentValue;
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['max']) {
      this.ensureMaxRange();
      this.setExternalValue(this.externalRating);
      this.internalCurrentValue = this.currentValue;
    }

    if (changes['externalRating']) {
      this.setExternalValue(changes['externalRating'].currentValue);
      this.internalCurrentValue = this.currentValue;
      this.hasInteracted = this.externalRating ? true : false

    }
  }

  protected onSliderInput(value: string): void {
    if (this.isDisable) return

    this.hasInteracted = true;
    this.internalCurrentValue = parseInt(value, 10);
    this.isDragging = true;
  }

  protected onSliderMouseUp(): void {
    if (this.isDragging && this.internalCurrentValue && !this.isDisable) {
      
      this.currentValue = this.internalCurrentValue;
      this.emitRealRating();
      this.isDragging = false;

    }
  }

  private ensureMaxRange(): void {
    if (this.max < 1) {
      this.max = 1;
    } else if (this.max > 100) {
      this.max = 100;
    }
  }

  private emitRealRating(): void {
    const realRating = Math.round((this.currentValue / this.max) * 100);
    this.ratingChange.emit(realRating);
  }

  private setExternalValue(newValue: number | undefined): void {
    if (newValue !== undefined && newValue >= 0 && newValue <= 100) {
      this.currentValue = Math.round((newValue / 100) * this.max);
      this.internalCurrentValue = this.currentValue; 
    } else {
      this.currentValue = this.min;
      this.internalCurrentValue = this.min;
    }
  }
}