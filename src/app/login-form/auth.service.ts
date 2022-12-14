import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { Router } from '@angular/router';
import { LoginFormComponent } from './login-form.component';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private fireAuth: AngularFireAuth, private router: Router) {}

  login(email: string, password: string){
   this.fireAuth.signInWithEmailAndPassword(email,password).then( (res) => {
    localStorage.setItem('user',JSON.stringify(res))
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
