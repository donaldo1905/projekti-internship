import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthService, User } from '../authentification/auth.service';


@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit{
loginForm!: FormGroup;
registerForm!: FormGroup;
toggle: boolean = false

constructor(private auth: AuthService){}

ngOnInit(): void {
  this.loginForm = new FormGroup({
    'loginEmail': new FormControl(null, [Validators.required, Validators.email]),
    'loginPassword': new FormControl(null, [Validators.required, Validators.minLength(8)])
    })

  this.registerForm = new FormGroup({
    'firstName': new FormControl(null, [Validators.required, Validators.minLength(3)]),
    'lastName': new FormControl(null, [Validators.required, Validators.minLength(3)]),
    'registerEmail': new FormControl(null, [Validators.required, Validators.email]),
    'registerPassword': new FormControl(null, [Validators.required, Validators.minLength(8)]),
    'confirmPassword': new FormControl(null, [Validators.required, Validators.minLength(8)])
  })
  this.registerForm.addValidators(
    this.matchValidator(this.registerForm.get('registerPassword')!, this.registerForm.get('confirmPassword')!)
  );

}

matchValidator(
  control: AbstractControl,
  controlTwo: AbstractControl
): ValidatorFn {
  return () => {
    if (control.value !== controlTwo.value){
      return { match_error: 'Value does not match' }};
    return null;
  };
}

login(){
  this.auth.login(this.loginForm.get('loginEmail')?.value, this.loginForm.get('loginPassword')?.value)
}

register(){
  let newUser: User = {firstName: this.registerForm.get('firstName')!.value, 
  lastName: this.registerForm.get('lastName')!.value,
  ratings: [],
  email: this.registerForm.get('registerEmail')!.value,
  savedMovies: [],
  role: 'user'
}
  this.auth.register(this.registerForm.get('registerEmail')?.value, this.registerForm.get('registerPassword')?.value, newUser)
}



}
