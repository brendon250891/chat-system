import { Component } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';
import { Router } from '@angular/router';
import { DatabaseService } from './services/database.service';
import { MessageService } from './services/message.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'chat-system';
  isLoggedIn: boolean = false; 

  constructor(private auth: AuthenticationService, private database: DatabaseService) {
    this.auth.isLoggedIn$.subscribe(val => {
      this.isLoggedIn = val;
    });
  }
}
