import { Component, HostListener, OnInit  } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { BarComponent } from "../../../../ui/bar/bar.component";
import { SearchComponent } from "../../inputs/search/search.component";
import { SelectComponent } from '../../inputs/select/select.component';
import { MovieBasicInfo, MovieService } from '../../../services/movie/movie.service';
import { MovieCardComponent } from "../../movie-card/movie-card.component";

@Component({
  selector: 'app-home',
  imports: [SelectComponent, BarComponent, SearchComponent, TitleCasePipe, MovieCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  movies: MovieBasicInfo[] = [];
 
  selectedGenres: string[] = []
  isMobile: boolean = false;
  selectValue?: string;

  constructor(private movieService: MovieService){}

  ngOnInit(){
    this.movies = this.movieService.getMovies();
    this.checkScreenSize();
    console.log(this.movies);
    
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  checkScreenSize() {
    if (typeof window !== 'undefined') {
      this.isMobile = window.innerWidth < 1215;
    }
  }

  onSelectionChange(value: string) {
    this.selectValue = value;
  }
  
  onSelectedGenresChange(selectedGenres: string[]) {
    this.selectedGenres = selectedGenres
    console.log('Generos seleccionados:', selectedGenres);
  }

  onSearch(term: string){
    console.log(term);
  }
}
