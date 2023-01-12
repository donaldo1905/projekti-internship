import { Component, OnInit } from '@angular/core';
import { AuthService } from '../authentication/auth.service';
import { ItemModel, User } from '../interfaces/interfaces';


@Component({
  selector: 'app-saved-movies',
  templateUrl: './saved-movies.component.html',
  styleUrls: ['./saved-movies.component.scss']
})
export class SavedMoviesComponent implements OnInit {
  activeUser?: User;
constructor(private authService: AuthService){}
  ngOnInit(): void {
    this.getActiveUser()
  }

  getActiveUser(){
    this.authService.getUser(localStorage.getItem('id')!).get().subscribe(user => this.activeUser = user.data())
  }

  remove(item: ItemModel){
       for(let i = 0; i< this.activeUser!.savedMovies.length; i++){
        if(this.activeUser?.savedMovies[i].id === item.id){
          this.activeUser?.savedMovies.splice(i,1)
          this.authService.getUser(localStorage.getItem('id')!).update({ savedMovies: this.activeUser?.savedMovies })
        }
       }
  }

  logout(): void {
    this.authService.signOut()
  }
}
