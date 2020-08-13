import { Component } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'chat-system';

  constructor(private auth: AuthenticationService, private route: Router) {}

  isLoggedIn(): boolean {
    return this.auth.isLoggedIn;
  }
}
