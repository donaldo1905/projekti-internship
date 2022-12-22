import { HttpClient } from '@angular/common/http';
import { Token } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { getToken } from '@angular/fire/app-check';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs'
import { ItemModel } from '../services/items.service';

export interface User{
  firstName: string
  lastName: string
  email: string
  usersid?: string
  savedMovies: ItemModel[]
  ratings: {movieId: string, rating: number}[]
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userId!: string
  loggedUser = new BehaviorSubject<any>(null)
  constructor(private fireAuth: AngularFireAuth, private router: Router, private http: HttpClient) {}

  login(email: string, password: string){
   this.fireAuth.signInWithEmailAndPassword(email,password).then( (res) => {
    res.user?.getIdToken().then( token => {
      this.loggedUser.next(token)
      localStorage.setItem('token', token)})
    this.router.navigate(['/home'])
   },err => {
     alert(err.message); 
   })
  }

  register(email: string, password: string){
    this.fireAuth.createUserWithEmailAndPassword(email,password).then( (res) =>{
      this.userId = res.user!.uid
      console.log()
      alert('Success')
    },err => {
      alert(err.message)
    }
     )
  }

  registerUser(user: User): Observable<User>{
    console.log(this.userId)
    let newUser: User ={
      firstName: user.firstName, 
  lastName: user.lastName,
  ratings: [],
  usersid: this.userId,
  email: user.email,
  savedMovies: []
    }
    return this.http.post<User>("https://projekt-internship-default-rtdb.europe-west1.firebasedatabase.app/users.json",newUser)
  }

  signOut(){
    this.fireAuth.signOut().then( () => {
      this.router.navigate(['/login'])
    }, err => {
      alert(err.message)
    })
  }
}
