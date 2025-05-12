import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { filter, Subscription, take } from 'rxjs';
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
    CollapsibleSectionComponent
],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit, OnDestroy {
  private userService = inject(UserService);
  private movieService = inject(MovieService);
  private activateRoute = inject(ActivatedRoute);

  @ViewChild(ModalComponent) modalComponent!: ModalComponent;

  private userSubscription?: Subscription;

  protected user: BasicUser | null = null;
  protected movies: MovieBasicInfo[] = [];
  
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


  ngOnInit(): void {

    this.loadDataUser();

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

    this.userSubscription = this.userService.currentUser$
      .pipe(
        filter((currentUser) => currentUser !== null),
      )
      .subscribe((currentUser) => {
        this.user = currentUser;

        if (this.user?.status === 'blocked') {

          //-----------------
        }

        if (!this.user.statistics) {
          this.userService.statisticsUser();
        }
        
        this.loadUserMovies();
        
      });

  }


  private loadUserMovies(newTermSearch?: string , typeList?: TypeList) {
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

  protected onSearch(term: string): void {    
    this.searchTerm = term;
    this.loadUserMovies(term, this.typeList)
  }


  protected onTypeListChange(list: TypeList): void{
    if (this.typeList === list) return
    
    this.typeList = list;
    this.loadUserMovies(this.searchTerm, list);

  }


  openModalSettings() {
    if (this.modalComponent) this.modalComponent.openModal();
    
  }
}
