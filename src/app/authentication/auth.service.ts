import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore'
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs'
import { ItemModel } from '../services/items.service';

export interface User{
  firstName: string
  lastName: string
  savedMovies: ItemModel[]
  ratings: {movieId: string, rating: number}[]
  role: 'user'
  uid?: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loggedUser = new BehaviorSubject<any>(null)
  constructor(private fireAuth: AngularFireAuth, private router: Router, private fireStore: AngularFirestore) {}

  login(email: string, password: string){
   this.fireAuth.signInWithEmailAndPassword(email,password).then( (res) => {
    localStorage.setItem('id', res.user?.uid!)
    res.user?.getIdToken().then( token => {
      this.loggedUser.next(token)
      localStorage.setItem('token', token)})
    setTimeout(() => {this.router.navigate(['/home'])}, 1000)
   },err => {
     alert(err.message); 
   })
  }

  register(email: string, password: string, user: User){
    this.fireAuth.createUserWithEmailAndPassword(email,password).then( res => {
      localStorage.setItem('id', res.user?.uid!)
      this.registerUser(res.user);
      this.update(user)
      setTimeout(() => {this.router.navigate(['/home'])}, 1000)
      alert('Success')
    },err => {
      alert(err.message)
    }
     ) 
  }

  registerUser(user: any){
    const newUser: AngularFirestoreDocument<any> = this.fireStore.doc(
      `users/${user.uid}`
    );
    const userData: any = {
        email: user.email,
        uid: user.uid    
      }
      return newUser.set(userData, {merge: true})
  }

  update(user: User){
    this.fireStore.collection('users').doc(localStorage.getItem('id')!).update({firstName: user.firstName, lastName: user.lastName, role: user.role, ratings: user.ratings, savedMovies: user.savedMovies})
  }

  getUser(id: string){
    return this.fireStore.collection('users').doc<User>(id)
  }

  getUsers(){
   return this.fireStore.collection('users').get()
  }

  signOut(){
    this.fireAuth.signOut().then( () => {
      localStorage.clear()
      this.router.navigate(['/login'])
    }, err => {
      alert(err.message)
    })
  }
}
