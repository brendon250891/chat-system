import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './../services/authentication.service';
import { Validator } from '../models/classes/validator';
import { FormError } from '../models/classes/formError';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  formError: FormError = null;
  form: Form = {
    username:  "",
    password: "",
  } 
  invalidCredentials: boolean = false;

  constructor(private route: Router, private auth: AuthenticationService) { }

  ngOnInit(): void {
  }

  login(): void {
    this.formError = new Validator(this.form).validate([
      { property: "username", rules: ['required'] },
      { property: "password", rules: ['required'] }
    ]);

    if (!this.formError.hasErrors()) {
      this.auth.login(this.form.username, this.form.password);
      if (this.auth.isLoggedIn) {
        this.route.navigateByUrl('/dashboard');
      }
      this.invalidCredentials = true;
    }
  }

  cancel(): void {
    this.route.navigateByUrl('/');
  }
}

interface Form {
  username: string;
  password: string;
}
