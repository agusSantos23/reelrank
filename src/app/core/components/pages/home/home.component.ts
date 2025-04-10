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
import { UtilsService } from '../../../services/utils/utils.service';
import { SelectOption } from '../../../models/selectOption.model';

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

  private utilService = inject(UtilsService)
  private movieService = inject(MovieService);
  private genreService = inject(GenreService);

  private movieSubscription?: Subscription;
  private genreSubscription?: Subscription;

  protected movies: MovieBasicInfo[] = [];
  protected possibleGenres: Genre[] = [];
  protected activeGenres: Genre[] = [];
  protected previousActiveGenres: Genre[] = [];
  protected showSlider: boolean = false;

  protected orderBy: string = 'title';
  protected selectOption: SelectOption[] = [
    { value: 'title', label: 'ALL MOVIES' },
    { value: 'score', label: 'TOP MOVIES' },
    { value: 'release_date', label: 'RELEASE DATE' }
  ]

  protected searchTerm?: string

  protected isMobile: boolean = false;

  

  private page = 1;
  protected limit = 20;
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



  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (!this.loading && !this.allDataLoaded) {
      const scrollPosition = window.scrollY + window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const threshold = 400;

      if (scrollPosition > documentHeight - threshold) this.loadMoreMovies();
    }
  }

  loadMoreMovies(newOrderBy?: string, newTermSearch?: string): void {

    if (newOrderBy) {
      this.movies = [];
      this.page = 1;
      this.allDataLoaded = false;
    }

    if (newTermSearch) {
      this.movies = [];
      this.page = 1;
      this.allDataLoaded = false;
    }

    if (!this.utilService.areArraysEqual(this.previousActiveGenres, this.activeGenres)) {
      this.movies = [];
      this.page = 1;
      this.allDataLoaded = false;
      this.previousActiveGenres = [...this.activeGenres];
    }

    if (this.loading || this.allDataLoaded) return;

    this.loading = true;
    const activeGenreIds = this.activeGenres.map(genre => genre.id);

    this.movieService.getMovies(this.page, this.limit, activeGenreIds, this.orderBy, this.searchTerm).subscribe({
      next: (data: MovieBasicInfo[]) => {        
        if (data.length === 0) {
          this.allDataLoaded = true;

        } else {

          const newMovies = data.filter(newMovie => {
            return !this.movies.some(existingMovie => existingMovie.id === newMovie.id);
          });

          this.movies = [...this.movies, ...newMovies];
          this.page++;
          if (data.length < this.limit) this.allDataLoaded = true;
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

  onOrderByChange(value: string): void {
    this.orderBy = value;
    console.log(this.orderBy);
    this.loadMoreMovies(value)
  }

  onSearch(term: string): void {

    this.searchTerm = term;
    this.loadMoreMovies(this.orderBy, term)
  }

  showSliderGenres(): void {
    this.genreService.getGenres().subscribe({
      next: (data: Genre[]) => {
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


  onNewGenderSearch(gender: Genre): void {

    this.activeGenres.push(gender);

    this.showSlider = false;

    this.loadMoreMovies();
  }

  onCancelGender(genderId: string): void {
    this.activeGenres = this.activeGenres.filter(genre => genre.id !== genderId);
    this.loadMoreMovies();
  }


}
