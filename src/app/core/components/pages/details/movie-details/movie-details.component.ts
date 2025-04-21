import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../../../../services/movie/movie.service';
import { Subscription } from 'rxjs';
import { Movie } from '../../../../models/movie/Movie.model';
import { BtnIconComponent } from "../../../inputs/buttons/btn-icon/btn-icon.component";
import { FormatDatePipe } from '../../../../pipe/format-date/format-date.pipe';
import { BarComponent } from "../../../ui/bar/bar.component";

@Component({
  selector: 'app-movie-details',
  imports: [BtnIconComponent, FormatDatePipe, BarComponent],
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.css'
})
export class MovieDetailsComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private movieService = inject(MovieService);

  private movieSubscription?: Subscription;
  
  protected movieId?: string;
  protected movie?: Movie

  ngOnInit(): void {
    this.movieId = this.route.snapshot.paramMap.get('id') || undefined;

    if (this.movieId) {
      
      this.movieService.getMovie(this.movieId).subscribe({
        next: (data: Movie) => {
          this.movie = data;
        },
        error: (error) => {
          console.error('Error obtaining more films:', error);
        }
      })

    }else{

    }

  }

  ngOnDestroy(): void {
    if (this.movieSubscription) this.movieSubscription.unsubscribe();
  }
}
