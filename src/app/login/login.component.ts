import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: Form = {
    username:  "",
    password: "",
  } 

  constructor(private route: Router, private auth: AuthenticationService) { }

  ngOnInit(): void {
  }

  login(): void {
    console.log("Hit login function");
    // client side error checking - no empty input.
    if (this.form.username != "" && this.form.password != "") {
      // if login unsuccessful, display error
      this.auth.login(this.form.username, this.form.password);
      if (this.auth.isLoggedIn) {
        this.route.navigateByUrl('/dashboard');
      }
      console.log("Invalid credentials given.");
      // display invalid credentials error.
    }
    console.log("Invalid data entered");
    // display error
  }

  cancel(): void {
    this.route.navigateByUrl('/');
  }
}

interface Form {
  username: string;
  password: string;
}
