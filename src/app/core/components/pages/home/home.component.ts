import { Component, HostListener, OnInit  } from '@angular/core';
import { BarComponent } from "../../ui/bar/bar.component";
import { SearchComponent } from "../../inputs/search/search.component";
import { SelectComponent } from '../../inputs/select/select.component';
import { MovieBasicInfo, MovieService } from '../../../services/movie/movie.service';
import { MovieCardComponent } from "../../movie-card/movie-card.component";
import { TitlePageComponent } from "../../ui/title-page/title-page.component";
import { OptionsSliderComponent } from "../../inputs/options-slider/options-slider.component";
import { BtnAuthComponent } from "../../inputs/btn-auth/btn-auth.component";
import { UpwardComponent } from "../../inputs/upward/upward.component";

@Component({
  selector: 'app-home',
  imports: [SelectComponent, BarComponent, SearchComponent, MovieCardComponent, TitlePageComponent, OptionsSliderComponent, BtnAuthComponent, UpwardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {

  movies: MovieBasicInfo[] = [];
  possibleGenres: string[] = ["War", "History", "Family", "Western", "Documentary", "Thriller", "Fantasy", "Animation", "Horror", "Music", "Comedy", "Drama", "Adventure", "Action", "Mystery", "Romance", "TV Movie", "Crime", "Science Fiction"];
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

  onSelectionChange(value: string): void {
    this.selectValue = value;
  }

  onSearch(term: string): void {
    console.log(term);
  }

  onNewGenderSearch(gender: string): void{
    console.log(gender);
    
  }

}
