import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { User } from '../models/classes/user';
import { HttpClient } from '@angular/common/http';
import { MessageService } from './message.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUser = new Subject<User>();
  private isLoggedIn = new Subject<boolean>();

  isLoggedIn$ = this.isLoggedIn.asObservable();
  currentUser$ = this.currentUser.asObservable();

  user: User = null;

  constructor(private messageService: MessageService, private http: HttpClient) { }

  login(username: string, password: string) {
    this.http.post<any>('http://localhost:3000/api/login', { 'username': username, 'password': password }).subscribe(response => {
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
}