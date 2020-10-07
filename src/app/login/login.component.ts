import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './../services/authentication.service';
import { Validator } from '../models/classes/validator';
import { FormError } from '../models/classes/formError';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  // Store subscriptions
  subscriptions: Array<Subscription> = [];

  // Stores any errors in the form
  formError: FormError = null;

  // Stores the values entered into the login form
  form: Form = {
    username:  "",
    password: "",
  } 

  constructor(private route: Router, private auth: AuthenticationService) { }

  /**
   * Do any setup
   */
  ngOnInit(): void {
    this.subscriptions.push(this.auth.isLoggedIn$.subscribe(val => {
      if (val) {
        this.route.navigateByUrl('dashboard');
      } else {
        this.route.navigateByUrl('logout');
      }
    }));
  }

  /**
   * Do any teardown
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  /**
   * Attempts to log the user in with given credentials
   */
  login(): void {
    this.formError = new Validator(this.form).validate([
      { property: "username", rules: ['required'] },
      { property: "password", rules: ['required'] }
    ]);

    if (!this.formError.hasErrors()) {
      this.auth.login(this.form.username, this.form.password);
    }
  }

  /**
   * Takes the user back to the home page
   */
  cancel(): void {
    this.route.navigateByUrl('/');
  }
}

interface Form {
  username: string;
  password: string;
}
