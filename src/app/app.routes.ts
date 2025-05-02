import { Routes } from '@angular/router';
import { HomeComponent } from './core/components/pages/home/home.component';
import { MovieDetailsComponent } from './core/components/pages/details/movie-details/movie-details.component';
import { LoginComponent } from './core/components/pages/auth/login/login.component';
import { RegisterComponent } from './core/components/pages/auth/register/register.component';
import { ErrorComponent } from './core/components/pages/error/error.component';



export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'details/movie/:id', component: MovieDetailsComponent },
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
  { path: 'error/:errorCode', component: ErrorComponent},
  { path: '**', redirectTo: 'error/404' },
];
