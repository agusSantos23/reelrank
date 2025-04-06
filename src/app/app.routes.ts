import { Routes } from '@angular/router';
import { HomeComponent } from './core/components/pages/home/home.component';
import { MovieDetailsComponent } from './core/components/pages/details/movie-details/movie-details.component';
import { NotFoundComponent } from './core/components/pages/error/not-found/not-found.component';



export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'details/movie', component: MovieDetailsComponent },
  { path: '**', component: NotFoundComponent }

];
