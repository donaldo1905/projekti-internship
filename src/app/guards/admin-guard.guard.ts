import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService, User } from '../authentication/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuardGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean |  Observable<boolean | UrlTree> | Promise<boolean> {
      if(!localStorage.getItem('id')){
        this.router.navigate(['/login'])
        return false
      }else
      this.auth.getUser().subscribe( (res: any) => {
        if(res.role === 'admin'){
          return true
        }else
        this.router.navigate(['/home'])
        return false
      }
      )
      return true
  }
}
