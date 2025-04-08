import { Component, Input } from '@angular/core';
import { TruncatePipe } from '../../pipe/truncate.pipe';
import { cardArrivesAnimation } from '../../directive/animations/cardArrives.animation';
import { cardEnlarge } from '../../directive/animations/cardEnlarge';
import { Router } from '@angular/router';
import { MovieBasicInfo } from '../../models/movie/movieBasicInfo';

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
  @Input() indexInBatch!: number; 
  @Input() movie!: MovieBasicInfo;

  private animationParams = { delay: 0 };
  protected arrivesState = { value: '*', params: this.animationParams };
  protected zoomState: 'normal' | 'hovered' = 'normal';

  constructor(private router: Router){}

  ngOnInit(): void {   
 
    this.animationParams.delay = this.indexInBatch * 100 + 200;
  }

  onMovieClick(): void {
    this.router.navigate(['/details/movie', {id: this.movie.id}]);
  }

  
}