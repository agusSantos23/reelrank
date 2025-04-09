import { Component, HostListener, inject, OnDestroy, OnInit } from '@angular/core';
import { BarComponent } from "../../ui/bar/bar.component";
import { SearchComponent } from "../../inputs/search/search.component";
import { SelectComponent } from '../../inputs/select/select.component';
import { MovieService } from '../../../services/movie/movie.service';
import { MovieCardComponent } from "../../movie-card/movie-card.component";
import { TitlePageComponent } from "../../ui/title-page/title-page.component";
import { OptionsSliderComponent } from "../../inputs/options-slider/options-slider.component";
import { BtnAuthComponent } from "../../inputs/buttons/btn-auth/btn-auth.component";
import { UpwardComponent } from "../../inputs/upward/upward.component";
import { Subscription } from 'rxjs';
import { MovieBasicInfo } from '../../../models/movie/movieBasicInfo';
import { GenreService } from '../../../services/genre/genre.service';
import { BtnIconComponent } from "../../inputs/buttons/btn-icon/btn-icon.component";
import { Genre } from '../../../models/Genre';
import { AssetCancelComponent } from '../../inputs/asset-cancel/asset-cancel.component';

@Component({
  selector: 'app-home',
  imports: [
    SelectComponent, 
    BarComponent, 
    SearchComponent, 
    MovieCardComponent, 
    TitlePageComponent, 
    OptionsSliderComponent, 
    BtnAuthComponent, 
    UpwardComponent, 
    BtnIconComponent,
    AssetCancelComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, OnDestroy {
  private movieService = inject(MovieService);
  private genreService = inject(GenreService);

  private movieSubscription?: Subscription;
  private genreSubscription?: Subscription;

  protected movies: MovieBasicInfo[] = [];
  protected possibleGenres: Genre[] = [];
  protected _activeGenres: Genre[] = [];
  protected isMobile: boolean = false;
  protected selectValue?: string;
  protected showSlider: boolean = false;

  private page = 1;
  protected limit = 30;
  protected loading = false;
  protected allDataLoaded = false;


  ngOnInit() {
    this.loadMoreMovies();
    this.checkScreenSize();
  }

  

  ngOnDestroy(): void {
    if (this.movieSubscription) this.movieSubscription.unsubscribe();
    if (this.genreSubscription) this.genreSubscription.unsubscribe();
  }

  protected get activeGenres(): Genre[] {
    return this._activeGenres;
  }

  protected set activeGenres(value: Genre[]) {
    this._activeGenres = value
    this.loadMoreMovies();
  }


  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (!this.loading && !this.allDataLoaded) {
      const scrollPosition = window.scrollY + window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const threshold = 200; 

      if (scrollPosition > documentHeight - threshold) this.loadMoreMovies();
    }
  }

  loadMoreMovies(): void {
    if (this.loading || this.allDataLoaded) return;

    this.loading = true;
    const activeGenreIds = this.activeGenres.map(genre => genre.id);

    this.movieService.getMovies(this.page, this.limit, activeGenreIds).subscribe({
      next: (data: MovieBasicInfo[]) => {

        if (this.activeGenres.length > 0) {
          this.movies = data;
          this.allDataLoaded = data.length < this.limit;
          this.page = 2; 

        } else {
          if (data.length === 0) {
            this.allDataLoaded = true;
          } else {
            this.movies = [...this.movies, ...data];
            this.page++;
          }
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error obtaining more films:', error);
        this.loading = false;
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.checkScreenSize();
  }

  checkScreenSize(): void {
    if (typeof window !== 'undefined') this.isMobile = window.innerWidth < 1215;
  }

  onSelectionChange(value: string): void {
    this.selectValue = value;
  }

  onSearch(term: string): void {
    console.log(term);
  }

  showSliderGenres(): void{
    this.genreService.getGenres().subscribe({
      next: (data: Genre[]) =>{
        this.possibleGenres = data.filter(genre => {
          return !this.activeGenres.some(activeGenre => activeGenre.id === genre.id);
        });
      },
      error: (error) => {
        console.error('Error obtaining genres:', error);
      }
    })


    this.showSlider = true;

  }

  onNewGenderSearch(gender: Genre): void{

    this.activeGenres = [...this._activeGenres, gender];

    this.showSlider = false
  }

  onCancelGender(genderId: string): void{    
    this.activeGenres = this._activeGenres.filter(genre => genre.id !== genderId);
  }

}
