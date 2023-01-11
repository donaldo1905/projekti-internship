import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '../authentication/auth.service';
import { ItemModel } from '../services/items.service';


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
    this.authService.getUser(localStorage.getItem('id')!).get().subscribe( res => {
       for(let i = 0; i< res.data()!.savedMovies.length; i++){
        if(res.data()!.savedMovies[i].id === item.id){
          this.activeUser?.savedMovies.splice(i,1)
          this.authService.getUser(localStorage.getItem('id')!).update({ savedMovies: this.activeUser?.savedMovies })
        }
       }
    })
  }

  logout(): void {
    this.authService.signOut()
  }
}
