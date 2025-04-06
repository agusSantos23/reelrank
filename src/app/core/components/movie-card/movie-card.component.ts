import { Component, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { MovieBasicInfo } from '../../services/movie/movie.service';
import { TruncatePipe } from '../../pipe/truncate.pipe';
import { cardArrivesAnimation } from '../../animations/cardArrives.animation';
import { cardEnlarge } from '../../animations/cardEnlarge';
@Component({
  selector: 'app-movie-card',
  imports: [TruncatePipe],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.css',
  animations: [
    cardArrivesAnimation,
    cardEnlarge
  ]
})
export class MovieCardComponent {
  @Input() index!: number; 
  @Input() movie!: MovieBasicInfo;
  @Output() movieClicked = new EventEmitter<string>()

  private animationParams = { delay: 0 };
  protected arrivesState = { value: '*', params: this.animationParams };
  protected zoomState: 'normal' | 'hovered' = 'normal';

  ngOnInit(): void {    
    this.animationParams.delay = this.index * 100 + 200;
  }

  onMovieClick() {
    this.movieClicked.emit(this.movie.id);
  }

  
}