import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  imports: [],
  templateUrl: './star-rating.component.html',
  styleUrl: './star-rating.component.css'
})
export class StarRatingComponent {
  @Input() maxStars: number = 5;
  @Input() initialRating: number = 0;
  @Output() ratingChange = new EventEmitter<number>();

  protected stars: { filled: boolean; }[] = [];
  private currentRating: number = 0;
  protected starSize: number = 40;

  ngOnInit(): void {    
    console.log("Componente:", this.currentRating);
    
    this.initializeStars();
    this.calculateStarSize();
    if (this.initialRating > 0 && this.initialRating <= this.maxStars) {
      this.setRating(this.initialRating);
    }
  }

  private initializeStars(): void {
    this.stars = Array(this.maxStars)
      .fill(null)
      .map(() => ({ filled: false }));

  }

  private setRating(rating: number): void {
    if (rating >= 0 && rating <= this.maxStars) {
      this.currentRating = Math.round(rating);
      this.updateStarDisplay();

      const percentage = ((this.currentRating - 1) / (this.maxStars - 1)) * 100;
      this.ratingChange.emit(percentage);
    }
  }

  protected handleStarClick(index: number): void {
    this.setRating(index + 1);
  }

  protected handleStarHover(index: number): void {
    this.updateStarDisplay(index + 1);

  }

  protected resetStarDisplay(): void {
    this.updateStarDisplay(this.currentRating);
  }

  protected updateStarDisplay(hoverRating?: number): void {
    const rating = hoverRating !== undefined ? hoverRating : this.currentRating;

    this.stars.forEach((star, i) => {
      const starValue = i + 1;

      star.filled = rating >= starValue

    });
  }

  protected calculateStarSize(): void {
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
}
