import { Injectable } from '@angular/core';
import { User } from '../models/classes/user';
import { MessageService } from './message.service';
import { Subject } from 'rxjs';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUser = new Subject<User>();
  private isLoggedIn = new Subject<boolean>();

  isLoggedIn$ = this.isLoggedIn.asObservable();
  currentUser$ = this.currentUser.asObservable();

  user: User = null;

  constructor(private messageService: MessageService, private databaseService: DatabaseService) { }

  public login(username: string, password: string) {
    this.databaseService.login(username, password).subscribe(response => {
      if (response.ok) {
        this.user = response.user;
        this.currentUser.next(response.user);
        this.isLoggedIn.next(true);
      } else {
        this.messageService.setMessage(response.message, "error");
      }
    }, error => {
      this.messageService.setMessage(error.error, "error");
    });
  }

  public logout() {
    this.isLoggedIn.next(false);
    this.currentUser.next(null);
  }

  public isAdmin(): boolean {
    return this.user.role == "Super Admin" || this.user.role == "Group Admin";
  }
}