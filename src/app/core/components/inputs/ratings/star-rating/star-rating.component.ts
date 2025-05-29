import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { lowerScaleAnimation } from '../../../../shared/directives/animations/trigger/lowerScale.animations';

@Component({
  selector: 'app-star-rating',
  imports: [],
  templateUrl: './star-rating.component.html',
  styleUrl: './star-rating.component.css',
  animations: [lowerScaleAnimation]
})
export class StarRatingComponent implements OnInit, OnChanges {
  @Input() maxStars: number = 5;
  @Input() externalRating?: number;
  @Input() isDisable: boolean = false;
  @Output() ratingChange = new EventEmitter<number>();

  public stars: { filled: boolean; }[] = [];
  public starAnimationStates: string[] = [];
  public starSize: number = 40;
  public internalRating: number = 0;

  ngOnInit(): void {

    this.initializeStars();
    this.calculateStarSize();

    if (this.externalRating !== undefined) {
      this.updateStarDisplay(this.percentageToRating(this.externalRating));
      this.internalRating = this.percentageToRating(this.externalRating);

    } else {
      this.updateStarDisplay(0);
      this.internalRating = 0;

    }
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['externalRating']) {
      const newExternalRating = changes['externalRating'].currentValue;

      if (newExternalRating !== undefined && newExternalRating >= 0 && newExternalRating <= 100) {
        const newInternalRating = Math.round((newExternalRating / 100) * (this.maxStars - 1) + 1);

        if (newInternalRating !== this.internalRating) {
          this.internalRating = newInternalRating;
          this.updateStarDisplay(this.internalRating);

        }

      } else if (newExternalRating === undefined) {
        this.updateStarDisplay(0);
        this.internalRating = 0;

      }
    }
  }

  public initializeStars(): void {

    this.starAnimationStates = Array(this.maxStars).fill('normal');
    this.stars = Array(this.maxStars)
      .fill(null)
      .map(() => ({ filled: false }));
  }

  public setRating(rating: number): void {
    if (rating >= 1 && rating <= this.maxStars) {
      this.internalRating = rating;
      this.updateStarDisplay(this.internalRating);
      this.ratingChange.emit(this.ratingToPercentage(this.internalRating));

    }
  }

  public handleStarClick(index: number): void {
    if (this.isDisable) return

    this.triggerStarAnimation(index)

    this.setRating(index + 1);

  }

  public handleStarHover(index: number): void {
    if (this.isDisable) return

    this.updateStarDisplay(index + 1);
  }

  public triggerStarAnimation(index: number): void {
    this.starAnimationStates[index] = 'clicked';

    setTimeout(() => {
      this.starAnimationStates[index] = 'normal';
    }, 200); 
  }

  public resetStarDisplay(): void {
    this.updateStarDisplay(this.internalRating);
  }

  public updateStarDisplay(rating: number): void {
    this.stars.forEach((star, i) => {
      star.filled = rating >= i + 1;
    });
  }

  public calculateStarSize(): void {
    if (this.maxStars >= 3 && this.maxStars <= 10) {
      const slope = (30 - 50) / (10 - 3);
      const intercept = 50 - slope * 3;
      this.starSize = slope * this.maxStars + intercept;

    } else if (this.maxStars < 3) {
      this.starSize = 50;

    } else {
      this.starSize = 30;

    }
  }

  public ratingToPercentage(rating: number): number {
    if (this.maxStars <= 1) return rating > 0 ? 100 : 0;
    return Math.round(((rating - 1) / (this.maxStars - 1)) * 100);
  }

  public percentageToRating(percentage: number): number {
    if (this.maxStars <= 1) return percentage > 0 ? this.maxStars : 0;
    return Math.round((percentage / 100) * this.maxStars);
  }


}