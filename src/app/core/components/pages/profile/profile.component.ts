import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { Subscription } from 'rxjs';
import { BasicUser } from '../../../models/auth/DataUser.model';
import { BarComponent } from "../../ui/bar/bar.component";
import { GoPageComponent } from "../../ui/go-page/go-page.component";
import { SearchComponent } from "../../inputs/search/search.component";
import { WrapperComponent } from "../../ui/wrapper/wrapper.component";
import { MovieBasicInfo } from '../../../models/movie/MovieBasicInfo.model';
import { MovieService } from '../../../services/movie/movie.service';
import { MovieCardComponent } from "../../ui/movie-card/movie-card.component";
import { InfoMessageComponent } from "../../ui/info-message/info-message.component";
import { LoadingSpinnerComponent } from "../../ui/loading-spinner/loading-spinner.component";
import { UpwardComponent } from "../../inputs/upward/upward.component";
import { ActivatedRoute } from '@angular/router';
import { Header, ModalComponent } from "../layout/modal/modal.component";
import { TooltipTriggerDirective } from '../../../shared/directives/functionality/tooltip-trigger/tooltip-trigger.directive';
import { CollapsibleSectionComponent } from "../../ui/collapsible-section/collapsible-section.component";
import { GenreService } from '../../../services/genre/genre.service';
import { Genre } from '../../../models/Genre.model';
import { NotificationService } from '../../../services/notification/notification.service';
import { timeBlocked } from '../../../interceptors/blocked-user/blocked-user.interceptor';
import { SliderRatingComponent } from "../../inputs/ratings/slider-rating/slider-rating.component";

export type TypeList = 'favorite' | 'see' | 'seen';

@Component({
  selector: 'app-profile',
  imports: [
    BarComponent,
    GoPageComponent,
    SearchComponent,
    WrapperComponent,
    MovieCardComponent,
    InfoMessageComponent,
    LoadingSpinnerComponent,
    UpwardComponent,
    ModalComponent,
    TooltipTriggerDirective,
    CollapsibleSectionComponent,
    SliderRatingComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit, OnDestroy {
  private userService = inject(UserService);
  private movieService = inject(MovieService);
  private genreService = inject(GenreService);
  private activateRoute = inject(ActivatedRoute);
  private notificationService = inject(NotificationService);


  @ViewChild(ModalComponent) modalComponent!: ModalComponent;

  private userSubscription?: Subscription;

  protected user: BasicUser | null = null;
  protected movies: MovieBasicInfo[] = [];
  protected genres: Genre[] = [];

  protected searchTerm?: string;
  protected typeList: TypeList = 'favorite';

  private page = 1;
  protected limit = 20;
  protected loading = false;
  private timeLoading = 1000;
  protected allDataLoaded = false;

  protected headerSettings: Header = {
    title: "Configure Profile"
  }

  protected selectedGenres: string[] = [];
  protected maxSelectedGenres = 3;
  protected selectEvaluator = 'starts'

  protected maxNumberStars = 5;
  protected maxSlider = 10;

  ngOnInit(): void {

    this.loadDataUser();

    this.loadGenres();



    this.activateRoute.paramMap.subscribe(params => {
      const listParam = params.get('list');

      if (listParam === 'favorite' || listParam === 'see' || listParam === 'seen') {
        this.typeList = listParam;
        this.loadUserMovies(this.searchTerm, listParam);
      }

    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) this.userSubscription.unsubscribe();
  }

  private loadDataUser() {
    this.userService.getUser();

    this.userSubscription = this.userService.currentUser$.subscribe((currentUser) => {
      this.user = currentUser;

      if (this.user) {
        if (this.user?.config_scorer) this.selectEvaluator = this.user.config_scorer;



        if (this.user?.status === 'blocked') timeBlocked(this.userService, this.notificationService);


        if (this.user && !this.user.statistics) this.userService.statisticsUser();

        this.maxNumberStars = this.user.maximum_star_rating;
        this.maxSlider = this.user.maximum_slider_rating;

      }

    

      this.loadUserMovies();

    });

  }


  private loadUserMovies(newTermSearch?: string, typeList?: TypeList) {
    this.loading = true;
    if (this.user?.id) {

      if (typeList || newTermSearch) {
        this.movies = [];
        this.page = 1;
        this.allDataLoaded = false;
      }


      this.movieService.getMoviesUser(this.page, this.limit, this.searchTerm, typeList).subscribe({
        next: (movies) => {

          setTimeout(() => {

            this.movies = movies;
            this.loading = false;

          }, this.timeLoading);

        },
        error: (error) => {
          console.error("Error charging user movies:", error);
        }
      });
    }
  }

  private loadGenres() {

    this.genreService.getGenres().subscribe({
      next: (data: Genre[]) => {
        this.genres = data;

        data.forEach(genre => genre.active && this.selectedGenres.push(genre.id))

      },
      error: (error) => {
        console.error('Error obtaining genres:', error);
      }
    })

  }

  protected onSearch(term: string): void {
    this.searchTerm = term;
    this.loadUserMovies(term, this.typeList)
  }

  protected onTypeListChange(list: TypeList): void {
    if (this.typeList === list) return

    this.typeList = list;
    this.loadUserMovies(this.searchTerm, list);

  }

  protected openModalSettings(): void {
    if (this.modalComponent) this.modalComponent.openModal();
  }

  protected toggleFavoriteGenre(genreId: string): void {

    if (this.user?.status === 'blocked') return 

    const index = this.selectedGenres.indexOf(genreId)


    if (index > -1) {
      this.selectedGenres.splice(index, 1);

      this.userService.favoriteGenres(this.selectedGenres).subscribe({
        next: () => {

          this.userService.getUser();

          this.showNotificationText('Your list of favorite genres has been updated.')

        },
        error: (err: any) => {
          console.error(err);
        }
      });

    } else if (this.selectedGenres.length < this.maxSelectedGenres) {

      this.selectedGenres.push(genreId);

      this.userService.favoriteGenres(this.selectedGenres).subscribe({
        next: () => {

          this.showNotificationText('Your list of favorite genres has been updated.')


        },
        error: (err: any) => {
          console.error(err);
        }
      });

    } else {

      this.showNotificationText('Maximum genres reached.Deselect one to choose another.', true)

    }



  }



  protected changeSelectEvaluator(value: 'starts' | 'slider'): void {

    if (this.selectEvaluator === value || this.user?.status === 'blocked') return

    this.selectEvaluator = value;

    this.userService.selectEvaluator(value).subscribe({
      next: () => {

        this.userService.getUser();

        this.showNotificationText('The way it scores movies has been updated');
      },
      error: (err: any) => {
        console.error(err);
      }
    })



  }

  protected sizeStars(acction: '+' | '-') {

    if (acction === '+') {

      if (this.maxNumberStars < 10) this.maxNumberStars++;

    } else {

      if (this.maxNumberStars > 3) this.maxNumberStars--;

    }

    this.userService.highestEvaluation('starts', this.maxNumberStars).subscribe({
      next: (response) => {
        
        this.userService.getUser();

        this.showNotificationText(response.message);

      },
      error: (err) =>{
        console.error(err);
      }
    })


  }

  protected sizeSlider(number: number){
    this.maxSlider = number;

    this.userService.highestEvaluation('slider', number).subscribe({
      next: (response) => {

        this.userService.getUser();

        console.log(response);
        
      },
      error: (err) =>{
        console.error(err);
      }
    })
  }

  get arrayNumberStars(): any[] {
    return new Array(this.maxNumberStars).fill(null);
  }






  private showNotificationText(text: string, error: boolean = false): void {

    this.notificationService.show({
      type: 'text',
      isError: error,
      text: text,
      position: 'tr',
      duration: 5000
    });
  }

}
