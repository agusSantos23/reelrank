import { Component, HostListener, inject, OnDestroy, OnInit } from '@angular/core';
import { BarComponent } from "../../ui/bar/bar.component";
import { SearchComponent } from "../../inputs/search/search.component";
import { SelectComponent } from '../../inputs/select/select.component';
import { MovieService } from '../../../services/movie/movie.service';
import { TitlePageComponent } from "../../ui/title-page/title-page.component";
import { OptionsSliderComponent } from "../../inputs/options-slider/options-slider.component";
import { BtnAuthComponent } from "../../inputs/buttons/btn-auth/btn-auth.component";
import { UpwardComponent } from "../../inputs/upward/upward.component";
import { filter, Subscription } from 'rxjs';
import { GenreService } from '../../../services/genre/genre.service';
import { BtnIconComponent } from "../../inputs/buttons/btn-icon/btn-icon.component";
import { Genre } from '../../../models/Genre.model';
import { AssetCancelComponent } from '../../inputs/asset-cancel/asset-cancel.component';
import { UtilsService } from '../../../services/utils/utils.service';
import { SelectOption } from '../../../models/SelectOption.model';
import { animate, style, transition, trigger } from '@angular/animations';
import { MovieCardComponent } from '../../ui/movie-card/movie-card.component';
import { UserService } from '../../../services/user/user.service';
import { ProfileAvatarComponent } from "../../ui/profile-avatar/profile-avatar.component";
import { BasicUser } from '../../../models/auth/DataUser.model';
import { InfoMessageComponent } from '../../ui/info-message/info-message.component';
import { LoadingSpinnerComponent } from '../../ui/loading-spinner/loading-spinner.component';
import { TooltipTriggerDirective } from '../../../shared/directives/functionality/tooltip-trigger/tooltip-trigger.directive';
import { MovieBasicInfo } from '../../../models/movie/MovieBasicInfo.model';

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
    AssetCancelComponent,
    ProfileAvatarComponent,
    InfoMessageComponent,
    LoadingSpinnerComponent,
    TooltipTriggerDirective,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  animations: [
    trigger('possibleGenreAnimate', [
      transition(':enter', [
        style({ width: '0' }),
        animate('.2s ease', style({ width: '180px' })),
      ]),
      transition(':leave', [
        animate('.2s ease', style({ width: '0' })),
      ]),
    ])
  ]
})
export class HomeComponent implements OnInit, OnDestroy {
  private userService = inject(UserService);
  private utilService = inject(UtilsService)
  private movieService = inject(MovieService);
  private genreService = inject(GenreService);

  private userSubscription?: Subscription;
  private movieSubscription?: Subscription;
  private genreSubscription?: Subscription;

  protected user: BasicUser | null = null;
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
    this.loadDataUser();
    this.checkScreenSize();
  }

  ngOnDestroy(): void {
    if (this.movieSubscription) this.movieSubscription.unsubscribe();
    if (this.genreSubscription) this.genreSubscription.unsubscribe();
    if (this.userSubscription) this.userSubscription.unsubscribe();
  }

  protected loadDataUser() {
    this.userService.getUser();

    this.userSubscription = this.userService.currentUser$.subscribe((currentUser) => {

      if (currentUser) {
        this.user = currentUser;
        
        if (this.user?.genres) {
          const formattedGenres = this.user.genres.map(genre => ({
            id: genre.id,
            name: genre.name,
            active: true
          }));

          this.activeGenres = formattedGenres;
          
        }

        this.movies = [];
        this.loadMoreMovies();

      }else{
        this.user = null;
        this.activeGenres = [];
        this.loadMoreMovies();
      }
      
    });



  }

  protected loadMoreMovies(newOrderBy?: string, newTermSearch?: string): void {
    
    if (newOrderBy || newTermSearch) {
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

        this.loading = false;

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


      },
      error: (error) => {
        console.error('Error obtaining more films:', error);
        this.loading = false;
      }
    });

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

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.checkScreenSize();
  }

  protected checkScreenSize(): void {
    if (typeof window !== 'undefined') this.isMobile = window.innerWidth < 1215;
  }

  protected onOrderByChange(value: string): void {
    this.orderBy = value;
    this.loadMoreMovies(value)

  }

  protected onSearch(term: string): void {
    this.searchTerm = term;
    this.loadMoreMovies(this.orderBy, term)

  }

  protected showSliderGenres(): void {

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

  protected onNewGenderSearch(gender: Genre): void {

    this.activeGenres.push(gender);

    this.showSlider = false;

    this.loadMoreMovies();
  }

  protected onCancelGender(genderId: string): void {
    this.activeGenres = this.activeGenres.filter(genre => genre.id !== genderId);
    this.loadMoreMovies();
  }

}
