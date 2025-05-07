import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../../../../services/movie/movie.service';
import { BtnIconComponent } from "../../../inputs/buttons/btn-icon/btn-icon.component";
import { FormatDatePipe } from '../../../../pipe/format-date/format-date.pipe';
import { BarComponent } from "../../../ui/bar/bar.component";
import { GoPageComponent } from "../../../ui/go-page/go-page.component";
import { ProfileAvatarComponent } from "../../../ui/profile-avatar/profile-avatar.component";
import { BtnAuthComponent } from "../../../inputs/buttons/btn-auth/btn-auth.component";
import { BasicUser } from '../../../../models/auth/DataUser.model';
import { UserService } from '../../../../services/user/user.service';
import { Subscription } from 'rxjs';
import { WrapperComponent } from "../../../ui/wrapper/wrapper.component";
import { DatePipe, TitleCasePipe, UpperCasePipe } from '@angular/common';
import { Header, ModalComponent } from "../../layout/modal/modal.component";
import { StarRatingComponent } from '../../../inputs/ratings/star-rating/star-rating.component';
import { SliderRatingComponent } from '../../../inputs/ratings/slider-rating/slider-rating.component';
import { FormatLargeNumberPipe } from '../../../../pipe/format-large-number/format-large-number.pipe';
import { AdjustFontSizeDirective } from '../../../../shared/directives/functionality/adjust-font-size/adjust-font-size.directive';
import { TooltipTriggerDirective } from '../../../../shared/directives/functionality/tooltip-trigger/tooltip-trigger.directive';
import { NotificationService } from '../../../../services/notification/notification.service';
import { timeBlocked } from '../../../../interceptors/blocked-user/blocked-user.interceptor';
import { Movie } from '../../../../models/movie/Movie.model';
import { TypeList } from '../../profile/profile.component';
import { ConvertToDecimalPipe } from '../../../../pipe/format-to-decimal/format-to-decimal';

export type ColumnRate =
  | 'rating'
  | 'story_rating'
  | 'acting_rating'
  | 'visuals_rating'
  | 'music_rating'
  | 'entertainment_rating'
  | 'pacing_rating';


@Component({
  selector: 'app-movie-details',
  imports: [
    BtnIconComponent,
    FormatDatePipe,
    BarComponent,
    GoPageComponent,
    ProfileAvatarComponent,
    BtnAuthComponent,
    WrapperComponent,
    StarRatingComponent,
    SliderRatingComponent,
    DatePipe,
    ModalComponent,
    UpperCasePipe,
    FormatLargeNumberPipe,
    TitleCasePipe,
    AdjustFontSizeDirective,
    TooltipTriggerDirective,
    ConvertToDecimalPipe
  ],
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.css',

})
export class MovieDetailsComponent implements OnInit {
  private userService = inject(UserService);
  private route = inject(Router)
  private activateRoute = inject(ActivatedRoute);
  private movieService = inject(MovieService);
  private notificationService = inject(NotificationService);

  @ViewChild('modalAuth') modalAuth!: ModalComponent;

  private userSubscription?: Subscription;

  protected user: BasicUser | null = null;
  protected movieId?: string;
  protected movie?: Movie;
  protected ratingValue?: number;
  protected seeMovieTooltipText: string = 'Add See';

  protected headerModal: Header = {
    title: 'WHO ARE YOU?',
    subtitle: 'Sign in or register to save your ratings and movie lists to your account.'
  }

  protected isGoProfile: TypeList | false = 'favorite';

  ngOnInit(): void {
    this.loadDataUser();


    this.activateRoute.paramMap.subscribe(params => {
      const profileParam = params.get('profile');
      
      if (profileParam === 'favorite' || profileParam === 'see' || profileParam === 'seen') {
        this.isGoProfile = profileParam;
      } else {
        this.isGoProfile = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) this.userSubscription.unsubscribe();
  }

  private loadMovie(): void {
    this.movieId = this.activateRoute.snapshot.paramMap.get('id') || undefined;

    if (this.movieId) {
      if (!this.isValidUuid(this.movieId)) {
        this.route.navigate(['error/404']);
        return;
      }

      if (this.user) {
        
        this.movieService.getUserMovie(this.movieId, this.user.id).subscribe({
          next: (data: Movie) => {
            console.log(data);

            this.movie = data;
            this.ratingValue = data.user_relation.rating;
            
            switch(this.movie.user_relation.seen){

              case true:
                this.seeMovieTooltipText = 'Remove of List';
                break;

              case false:
                this.seeMovieTooltipText = 'Add to Seen';
                break;

              default:
              this.seeMovieTooltipText = 'Add to See';
            }

          },
          error: (error) => {            
            this.route.navigate(['error/404']);
            console.error('Error obtaining more films:', error);
          }

        })

      } else {

        this.movieService.getMovie(this.movieId).subscribe({
          next: (data: Movie) => {

            this.movie = data;
          },
          error: (error) => {
            this.route.navigate(['error/404']);
            console.error('Error obtaining more films:', error);
          }
        })

      }

    }
  }

  private loadDataUser() {
    this.userService.getUser();

    this.userSubscription = this.userService.currentUser$.subscribe((currentUser) => {
      this.user = currentUser;
      console.log(this.user);

      if (this.user?.status === 'blocked') {
        timeBlocked(this.userService, this.notificationService);
      }

      this.loadMovie()
    });


  }

  private isValidUuid(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  protected receiveRating(value: number, column: ColumnRate): void {
    this.ratingValue = value;

    if (!this.user) {
      this.modalAuth.openModal();

    } else if (this.user?.status === 'blocked') {

      this.showNotificationText("Right now you are blocked.");
      
    } else {

      if (this.movieId) this.userService.rateMovie(this.movieId, column, value).subscribe({
        next: (response) => {
          this.showNotificationText(response.message);
        },
        error: (err) => {
          console.log(err);
        }
      })
    }


  }


  protected toggleFavorite(): void {


    if (!this.user) {
      this.modalAuth.openModal();

    } else if (this.user?.status === 'blocked') {

      this.showNotificationText("Right now you are blocked.");
      
    }else {

      if (this.movie && this.movie.user_relation) {
        this.movie.user_relation.is_favorite = !this.movie.user_relation.is_favorite;
                
          
          if (this.movieId) this.userService.favoriteMovie(this.movieId, this.movie.user_relation.is_favorite).subscribe({
            next: (response: any) => {
              console.log(response);
              this.showNotificationText(response.message);
              
            },
            error: (err: any) => {
              console.log(err);
            }
          })
        
      }

    }
        
  

  }

  protected toggleSeen(): void {

    if (this.movie) {

      if (!this.user) {
            
        this.modalAuth.openModal();

      } else if (this.user?.status === 'blocked') {

        this.showNotificationText("Right now you are blocked.");
        
      } else if (this.movie.user_relation) {

        switch (this.movie.user_relation.seen) {
          case false:
            this.movie.user_relation.seen = true;
            break;

          case true:
            this.movie.user_relation.seen = null;
            break;

          default:
            this.movie.user_relation.seen = false;
            break;

        }

        const seenValue = this.movie.user_relation.seen;


        if (this.movieId && seenValue !== undefined && typeof seenValue !== 'number') {

        
            this.userService.seeMovie(this.movieId, seenValue).subscribe({
              next: (response: any) => {
  
                this.showNotificationText(response.message)
  
                switch(seenValue){
  
                  case true:
                    this.seeMovieTooltipText = 'Remove of List';
                    break;
    
                  case false:
                    this.seeMovieTooltipText = 'Add to Seen';
                    break;
    
                  default:
                    this.seeMovieTooltipText = 'Add to See';
                }
  
              },
              error: (err: any) => {
                console.log(err);
              }
            });
          
          
        }


      } else {
        this.modalAuth.openModal();

      }
    }
  }


  protected cancelAuthModal(): void {
    this.ratingValue = undefined;

    this.modalAuth.closeModal();

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
