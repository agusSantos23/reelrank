import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormatLargeTitlePipe } from '../../../pipe/format-large-title/format-large-title.pipe';
import { cardArrivesAnimation } from '../../../shared/directives/animations/trigger/cardArrives.animation';
import { cardEnlarge } from '../../../shared/directives/animations/trigger/cardEnlarge.animation';
import { ToFixedZeroPipe } from '../../../pipe/toFixedZero/to-fixed-zero.pipe';
import { TooltipTriggerDirective } from '../../../shared/directives/functionality/tooltip-trigger/tooltip-trigger.directive';
import { MovieBasicInfo } from '../../../models/movie/MovieBasicInfo.model';

@Component({
  selector: 'app-movie-card',
  imports: [
    FormatLargeTitlePipe,
    ToFixedZeroPipe,
    TooltipTriggerDirective
  ],
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