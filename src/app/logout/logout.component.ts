import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  timeTilRedirect: number = 3;

  constructor(private route: Router, private auth: AuthenticationService) { }

  async ngOnInit(): Promise<void> {
    this.auth.logout();
    this.countdown();
  }

  countdown(): void {
    setTimeout(() => {
      this.timeTilRedirect--;
      if (this.timeTilRedirect > 0) {
        this.countdown();
      } else {
        this.route.navigateByUrl('/');
      }
    }, 1000);
  }
}
