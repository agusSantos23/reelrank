import { Component, EventEmitter, Input, Output, SimpleChanges, OnInit, OnChanges } from '@angular/core';
import { WrapperComponent } from "../../../ui/wrapper/wrapper.component";

@Component({
  selector: 'app-slider-rating',
  imports: [WrapperComponent],
  template: `
    <div>
      <input
        type="range"
        [min]="min"
        [max]="max"
        [value]="currentValue"
        [step]="step"
        (mouseup)="onSliderChange($any($event.target).value)"
        [style.marginRight]="isViewWindow ? '10px' : undefined"
      >
      @if(isViewWindow){
        <app-wrapper width="40px" [contentPading]="[5,2]" [containerPading]="3">
          {{ externalRating ? currentValue : '-' }}
        </app-wrapper>
      }
      
    </div>
  `,
  styleUrl: './slider-rating.component.css'
})
export class SliderRatingComponent implements OnInit, OnChanges {
  @Input() max: number = 10;
  @Input() externalRating?: number;
  @Input() isViewWindow: boolean = true;
  @Output() ratingChange = new EventEmitter<number>();

  protected min: number = 0;
  protected currentValue: number = 0;
  protected step: number = 1;

  ngOnInit(): void {
    this.ensureMaxRange();
    this.setExternalValue(this.externalRating);

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['max']) {
      this.ensureMaxRange();
      this.setExternalValue(this.externalRating);
    }

    if (changes['externalRating']) {
      this.setExternalValue(changes['externalRating'].currentValue);
    }

  }

  protected onSliderChange(value: string): void {
    this.currentValue = parseInt(value, 10);
    this.emitRealRating();

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
    } else {
      this.currentValue = this.min;
    }
  }
}