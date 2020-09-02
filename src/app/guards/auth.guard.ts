import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  subscriptions: Array<Subscription> = []; 
  isLoggedIn: boolean = false;

  constructor(private route: Router, private auth: AuthenticationService) {
    this.auth.isLoggedIn$.subscribe(val => {
      this.isLoggedIn = val;
    });
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // If their is a user logged into the session, proceed to chat dashboard
    if (this.isLoggedIn) {
      return true;
    }
    // Otherwise redirect to login page
    return this.route.navigateByUrl('login');
  }
  
}
