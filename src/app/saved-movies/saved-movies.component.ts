import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService, User } from '../authentification/auth.service';


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
}
