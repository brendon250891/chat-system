import { Component } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';
import { Router } from '@angular/router';
import { DatabaseService } from './services/database.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'chat-system';

  constructor(private auth: AuthenticationService, private database: DatabaseService) {
  }

  isLoggedIn(): boolean {
    return this.auth.isLoggedIn;
  }
}
