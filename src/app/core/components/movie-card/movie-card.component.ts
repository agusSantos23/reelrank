import { Component, inject, Input } from '@angular/core';
import { TruncatePipe } from '../../pipe/truncate/truncate.pipe';
import { cardArrivesAnimation } from '../../shared/directives/animations/trigger/cardArrives.animation';
import { Router } from '@angular/router';
import { MovieBasicInfo } from '../../models/movie/movieBasicInfo.model';
import { cardEnlarge } from '../../shared/directives/animations/trigger/cardEnlarge.animation';

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
  private router = inject(Router);

  @Input() delay!: number; 
  @Input() movie!: MovieBasicInfo;

  private animationParams = { delay: 0 };
  protected arrivesState = { value: '*', params: this.animationParams };
  protected zoomState: 'normal' | 'hovered' = 'normal';


  ngOnInit(): void {   
    this.animationParams.delay = this.delay * 100 + 200;
  }

  protected onMovieClick(): void {
    this.router.navigate(['/details/movie', this.movie.id]);
  }

  
}