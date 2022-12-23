import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailedPageComponent } from './detailed-page/detailed-page.component';
import { HomeComponent } from './home/home.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { SavedMoviesComponent } from './saved-movies/saved-movies.component';
import { AddOrEditFormComponent } from './shared/add-or-edit-form/add-or-edit-form.component';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginFormComponent},
  {path: 'addoredit', component: AddOrEditFormComponent},
  {path: 'details/:id', component: DetailedPageComponent},
  {path: 'savedmovies', component: SavedMoviesComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
