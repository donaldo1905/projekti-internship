import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { DetailedPageComponent } from './detailed-page/detailed-page.component';
import { AdminGuardGuard } from './guards/admin-guard.guard';
import { HomeGuardGuard } from './guards/home-guard.guard';
import { HomeComponent } from './home/home.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { SavedMoviesComponent } from './saved-movies/saved-movies.component';
import { AddOrEditFormComponent } from './shared/add-or-edit-form/add-or-edit-form.component';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent, canActivate: [HomeGuardGuard]},
  {path: 'login', component: LoginFormComponent},
  {path: 'details/:id', component: DetailedPageComponent},
  {path: 'savedmovies', component: SavedMoviesComponent},
  {path: 'admin', component: AdminPageComponent, canActivate: [AdminGuardGuard], children:[
     {path: 'addoredit/:id', component: AddOrEditFormComponent},
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
