import { Routes } from '@angular/router';
import { HomeComponent } from './core/components/pages/home/home.component';
import { MovieDetailsComponent } from './core/components/pages/details/movie-details/movie-details.component';
import { NotFoundComponent } from './core/components/pages/error/not-found/not-found.component';
import { LoginComponent } from './core/components/pages/auth/login/login.component';
import { RegisterComponent } from './core/components/pages/auth/register/register.component';



export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'details/movie/:id', component: MovieDetailsComponent },
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
  { path: '**', component: NotFoundComponent }

];
