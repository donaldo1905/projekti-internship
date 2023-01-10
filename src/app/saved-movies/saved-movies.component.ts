import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService, User } from '../authentication/auth.service';
import { ItemModel } from '../services/items.service';


@Component({
  selector: 'app-saved-movies',
  templateUrl: './saved-movies.component.html',
  styleUrls: ['./saved-movies.component.scss']
})
export class SavedMoviesComponent implements OnInit {
  activeUser?: User;
constructor(private auth: AuthService, private fireStore: AngularFirestore){}
  ngOnInit(): void {
    this.fireStore.collection('users').doc<User>(localStorage.getItem('id')!).valueChanges().subscribe(user => this.activeUser = user)
  }

  remove(item: ItemModel){
    this.fireStore.collection('users').doc<User>(localStorage.getItem('id')!).get().subscribe( res => {
       for(let i = 0; i< res.data()!.savedMovies.length; i++){
        if(res.data()!.savedMovies[i].id === item.id){
          let array1 = res.data()!.savedMovies.splice(0, i)
          let array2 = res.data()!.savedMovies.splice(i+1, res.data()!.savedMovies.length)
          this.fireStore.collection('users').doc(localStorage.getItem('id')!).update({ savedMovies: array1.concat(array2) })
        }
       }
    })
  }

  logout(): void {
    this.auth.signOut()
  }
}
