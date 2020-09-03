import { Injectable } from '@angular/core';
import { User } from '../models/classes/user';
import { HttpClient } from '@angular/common/http';
import { MessageService } from './message.service';
import { Subject } from 'rxjs';
import { SocketService } from './socket.service';
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

  login(username: string, password: string) {
    this.databaseService.login(username, password).subscribe(response => {
      if (response.ok) {
        this.isLoggedIn.next(true);
        this.user = response.user;
        this.currentUser.next(response.user);
      } else {
        this.messageService.setMessage(response.message, "error");
      }
    }, error => {
      this.messageService.setMessage(error.error, "error");
    });
  }

  logout() {
    this.isLoggedIn.next(false);
    this.currentUser.next(null);
  }

  public isAdmin(): boolean {
    return this.user.role == "super";
  }
}