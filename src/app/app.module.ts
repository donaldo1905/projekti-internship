import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginFormComponent } from './login-form/login-form.component';
import {MatButtonModule} from  '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatInputModule} from  '@angular/material/input';
import {MatCardModule} from  '@angular/material/card';
import {MatIconModule} from '@angular/material/icon'
import { HomeComponent } from './home/home.component';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { ShowMoreComponent } from './show-more/show-more.component';
import {  HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptorService } from './authentification/auth-interceptor.service';
import {MatSelectModule} from '@angular/material/select';
import { LatestPipe } from './pipes/latest.pipe';
import { AddOrEditFormComponent } from './shared/add-or-edit-form/add-or-edit-form.component';
import { RatingComponent } from './shared/rating/rating.component';






@NgModule({
  declarations: [
    AppComponent,
    LoginFormComponent,
    HomeComponent,
    ShowMoreComponent,
    LatestPipe,
    AddOrEditFormComponent,
    RatingComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatCardModule,
  MatInputModule,
  MatButtonModule,
  ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatIconModule,
    MatSelectModule,
    AngularFireModule.initializeApp(environment.firebase)

  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
