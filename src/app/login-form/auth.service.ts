import { Token } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { getToken } from '@angular/fire/app-check';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs'
import { LoginFormComponent } from './login-form.component';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loggedUser = new BehaviorSubject<any>(null)
  constructor(private fireAuth: AngularFireAuth, private router: Router) {}

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
    this.fireAuth.createUserWithEmailAndPassword(email,password).then( () =>{
      alert('Success')
    },err => {
      alert(err.message)
    }
     )
  }

  signOut(){
    this.fireAuth.signOut().then( () => {
      this.router.navigate(['/login'])
    }, err => {
      alert(err.message)
    })
  }
}
