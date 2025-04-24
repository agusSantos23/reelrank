import { Component, inject, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-movie-details',
  imports: [
    BtnIconComponent,
    FormatDatePipe,
    BarComponent,
    GoPageComponent,
    ProfileAvatarComponent,
    BtnAuthComponent,
    WrapperComponent
],
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.css'
})
export class MovieDetailsComponent implements OnInit {
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  private movieService = inject(MovieService);
  

  private userSubscription?: Subscription;
  
  protected user: BasicUser | null = null;
  protected movieId?: string;
  protected movie?: Movie

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

  loadDataUser(){
    this.userService.getUser();

    this.userSubscription = this.userService.currentUser$.subscribe((currentUser) => {
      this.user = currentUser
    });
  }


}
