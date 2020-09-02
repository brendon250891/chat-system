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
  subscriptions: Array<Subscription> = [];
  formError: FormError = null;
  form: Form = {
    username:  "",
    password: "",
  } 

  constructor(private route: Router, private auth: AuthenticationService) { }

  ngOnInit(): void {
    this.subscriptions.push(this.auth.isLoggedIn$.subscribe(val => {
      this.route.navigateByUrl(val ? '/dashboard' : '/logout');
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  login(): void {
    this.formError = new Validator(this.form).validate([
      { property: "username", rules: ['required'] },
      { property: "password", rules: ['required'] }
    ]);

    if (!this.formError.hasErrors()) {
      this.auth.login(this.form.username, this.form.password);
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
