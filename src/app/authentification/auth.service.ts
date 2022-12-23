import { HttpClient } from '@angular/common/http';
import { Token } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { getToken } from '@angular/fire/app-check';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable } from 'rxjs'
import { ItemModel } from '../services/items.service';

export interface User{
  firstName: string
  lastName: string
  email: string
  usersid?: string
  savedMovies: ItemModel[]
  ratings: {movieId: string, rating: number}[]
  role: 'user'
  id?: string
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
    this.http.get<User[]>("https://projekt-internship-default-rtdb.europe-west1.firebasedatabase.app/users.json").pipe(map((res: any) => {
      const products = []
      for(const key in res){
        if(res.hasOwnProperty(key)){
          products.push({...res[key], id: key})
        }
      }
      return products
    })).subscribe(users => {
       for(let user of users){
        if(user.usersid === res.user?.uid){
          localStorage.setItem('user', JSON.stringify(user))
        }
       }
    })
    
    res.user?.getIdToken().then( token => {
      this.loggedUser.next(token)
      localStorage.setItem('token', token)})
    setTimeout(() => {this.router.navigate(['/home'])}, 1000)
   },err => {
     alert(err.message); 
   })
  }

  register(email: string, password: string, user: User){
    this.fireAuth.createUserWithEmailAndPassword(email,password).then( (res) =>{
      let newUser: User ={
        firstName: user.firstName, 
        lastName: user.lastName,
        usersid: res.user?.uid,
        ratings: user.ratings,
        email: user.email,
        savedMovies: user.savedMovies,
        role: user.role
          }
        this.http.post("https://projekt-internship-default-rtdb.europe-west1.firebasedatabase.app/users.json", newUser)
        .subscribe()
      alert('Success')
    },err => {
      alert(err.message)
    }
     ) 
  }

  editUser(user: User): Observable<User>{
    return this.http.patch<User>("https://projekt-internship-default-rtdb.europe-west1.firebasedatabase.app/users/"+user.id+".json", user)
  }

  getUsers(): Observable<User>{
  return this.http.get<User>("https://projekt-internship-default-rtdb.europe-west1.firebasedatabase.app/users.json")
  }

  getUser(id: string): Observable<User>{
    return this.http.get<User>("https://projekt-internship-default-rtdb.europe-west1.firebasedatabase.app/users/"+id+".json")
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
