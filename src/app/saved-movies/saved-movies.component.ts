import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '../authentification/auth.service';
import { ItemModel } from '../services/items.service';

@Component({
  selector: 'app-saved-movies',
  templateUrl: './saved-movies.component.html',
  styleUrls: ['./saved-movies.component.scss']
})
export class SavedMoviesComponent implements OnInit {
  savedItems!: ItemModel[]
constructor(private auth: AuthService){}
  ngOnInit(): void {
   let activeUser: User = JSON.parse(localStorage.getItem('user')!)
this.auth.getUser(activeUser.uid!).subscribe(user => {
  console.log(user.savedMovies)
this.savedItems = user.savedMovies
})
  }
}
