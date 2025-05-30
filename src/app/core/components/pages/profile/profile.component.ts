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
import { ActivatedRoute, Router } from '@angular/router';
import { Header, ModalComponent } from "../layout/modal/modal.component";
import { TooltipTriggerDirective } from '../../../shared/directives/functionality/tooltip-trigger/tooltip-trigger.directive';
import { CollapsibleSectionComponent } from "../../ui/collapsible-section/collapsible-section.component";
import { GenreService } from '../../../services/genre/genre.service';
import { Genre } from '../../../models/Genre.model';
import { NotificationService } from '../../../services/notification/notification.service';
import { timeBlocked } from '../../../interceptors/blocked-user/blocked-user.interceptor';
import { SliderRatingComponent } from "../../inputs/ratings/slider-rating/slider-rating.component";
import { InfoInputComponent } from "../../inputs/info-input/info-input.component";
import { AbstractControlOptions, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FocusInputDirective } from '../../../shared/directives/functionality/focus-input/focus-input.directive';
import { FloatingLabelDirective } from '../../../shared/directives/animations/floating-label/floating-label.directive';
import { CustomValidators } from '../../../shared/validators/custom-validators';
import { ViewInputComponent } from "../../inputs/view-input/view-input.component";

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
    SliderRatingComponent,
    InfoInputComponent,
    FocusInputDirective,
    FloatingLabelDirective,
    ReactiveFormsModule,
    ViewInputComponent
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
  private router = inject(Router)


  @ViewChild('modalSettings') modalSettingsComponent!: ModalComponent;
  @ViewChild('modalDangerActions') modalDangerActionsComponent!: ModalComponent;

  protected emailForm = new FormControl('', [Validators.required, Validators.email]);

  protected formPassword = new FormGroup({
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(64),
      CustomValidators.hasUpperCase,
      CustomValidators.hasLowerCase,
      CustomValidators.hasSpecialCharacter
    ]),
    password_confirmation: new FormControl('', [Validators.required])
  }, { validators: CustomValidators.mustMatch('password', 'password_confirmation') } as AbstractControlOptions);

  private userSubscription?: Subscription;


  protected infoInputs = {
    "email": [
      "Provide a valid email address (user@example.com)"
    ],
    "password": [
      "Must be at least 8 characters",
      "Must be no more than 64 characters",
      "Must contain at least one uppercase letter",
      "Must contain at least one lowercase letter",
      "Must contain at least one special character"
    ],
    "confirmPassword": [
      "Enter your password again for confirmation",
    ],
  };

  protected headerDeleteCount: Header = {
    title: 'Delete Count',
    subtitle: 'Are you sure you want to delete your account?'

  }

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

  protected selectedGenres: string[] = [];
  protected maxSelectedGenres = 3;
  protected selectEvaluator = 'starts'

  protected maxNumberStars = 5;
  protected maxSlider = 10;

  protected selectDangerousActions: 'email' | 'password' | 'delete' = 'email';

  protected viewPassword = false;
  protected viewConfirmPassword = false;

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
    if (this.modalSettingsComponent) this.modalSettingsComponent.openModal();
  }

  protected openModalDangerousActions(acction: 'email' | 'password' | 'delete') {

    if (this.modalDangerActionsComponent) {

      this.selectDangerousActions = acction;

      setTimeout(() => {
        this.modalDangerActionsComponent.openModal();
      }, 0);

    }
  }

  protected closeModalDangerousActions(acction: 'email' | 'password' = 'email') {

    if (this.modalDangerActionsComponent) {

      this.selectDangerousActions = acction;

      setTimeout(() => {
        this.modalDangerActionsComponent.closeModal(false);
      }, 0);

    }

    acction === 'email'
      ?this.emailForm.reset()
      :this.formPassword.reset()
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
      error: (err) => {
        console.error(err);
      }
    })


  }

  protected sizeSlider(number: number) {
    this.maxSlider = number;

    this.userService.highestEvaluation('slider', number).subscribe({
      next: (response) => {

        this.userService.getUser();


      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  get arrayNumberStars(): any[] {
    return new Array(this.maxNumberStars).fill(null);
  }

  protected onSubmitEmail() {

    if (this.emailForm.valid && this.emailForm.value) {


      this.userService.updateUserField('email', this.emailForm.value).subscribe({
        next: (response) => {

          this.showNotificationText(response.message);

          this.loadDataUser();

          this.closeModalDangerousActions('email')
          

        },
        error: (err) => {
          console.error(err);

        }
      })

    } else {
      this.emailForm.markAllAsTouched()

    }
  }

  protected onSubmitPassword() {

    if (this.formPassword && this.formPassword.valid) {

      const userPassword = {
        password: this.formPassword.value.password || '',
        password_confirmation: this.formPassword.value.password_confirmation || ''
      };

      

      this.userService.updateUserField('password', userPassword).subscribe({
        next: (response) => {
          this.showNotificationText(response.message);

          this.loadDataUser();

          this.closeModalDangerousActions('password')
        },
        error: (err) => {
          console.error(err);

        }

      })

    } else {
      
      this.formPassword.markAllAsTouched()

    }

  }

  protected deleteCount(){

    this.userService.deleteUser().subscribe({
        next: (response) => {

          this.notificationService.show({
            type: 'timeline',
            isError: false,
            text: response.message,
            position: 'tr',
            duration: 4000
          });          

          this.closeModalDangerousActions()

          this.modalSettingsComponent.closeModal();
          
          setTimeout(() => {
            this.loadDataUser();

            this.router.navigate(['auth/login']);
          }, 4000);

        },
        error: (err) => {
          console.error(err);

        }

      })



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
