import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../../../../services/movie/movie.service';
import { Movie } from '../../../../models/movie/Movie.model';
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
import { StarRatingComponent } from "../../../inputs/star-rating/star-rating.component";
import { DatePipe } from '@angular/common';
import { Header, ModalComponent } from "../../layout/modal/modal.component";

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
    DatePipe,
    ModalComponent
],
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.css'
})
export class MovieDetailsComponent implements OnInit {
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  private movieService = inject(MovieService);
  
  @ViewChild('modalAuth') modalAuth!: ModalComponent;

  private userSubscription?: Subscription;
  
  protected user: BasicUser | null = null;
  protected movieId?: string;
  protected movie?: Movie;
  protected ratingValue: number = 0;

  protected headerModal: Header = {
    title: 'WHO ARE YOU?',
    subtitle: 'Sign in or register to save your ratings and movie lists to your account.'
  }

  ngOnInit(): void {
   
    this.loadMovie()
    this.loadDataUser();

  }

  ngOnDestroy(): void {
    if (this.userSubscription) this.userSubscription.unsubscribe();
  }


  private loadMovie(): void{
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

    }
  }

  private loadDataUser(){
    this.userService.getUser();

    this.userSubscription = this.userService.currentUser$.subscribe((currentUser) => {
      this.user = currentUser
    });

    if (this.user) {
      // Asignar valor de la puntuacion del usuario
      //this.ratingValue =
    }

    console.log(this.user);
    
  }


  protected receiveRating(value: number): void {
    this.ratingValue = value;

    if (!this.user) this.modalAuth.openModal();
  }

  protected cancelAuthModal(): void{
    console.log(this.ratingValue);
    
    this.ratingValue = 0;
    console.log(this.ratingValue);
    
    this.modalAuth.closeModal();

  }

}
