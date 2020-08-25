import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { User } from '../models/classes/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  isLoggedIn: boolean = false;

  private currentUser: User = null;

  constructor(private database: DatabaseService) { }

  login(username: string, password: string): boolean {
    this.currentUser = this.database.getUser(username, password);
    this.isLoggedIn = this.currentUser ? true : false;
    return this.isLoggedIn;
  }

  logout() {
    this.isLoggedIn = false;
    this.currentUser = null;
  }

  user(): User {
    return this.currentUser;
  }

  hasRole(name: string) {
    return this.currentUser.role === name;
  }
}