import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { MovieBasicInfo } from '../../services/movie/movie.service';
import { TruncatePipe } from '../../pipe/truncate.pipe';

@Component({
  selector: 'app-movie-card',
  imports: [TruncatePipe],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.css'
})
export class MovieCardComponent {
  @Input() movie!: MovieBasicInfo;
 
}