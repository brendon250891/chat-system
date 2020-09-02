import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DatabaseService } from '../services/database.service';
import { RegistrationForm } from '../models/interfaces/form';
import { FormError } from 'src/app/models/classes/formError';
import { Validator } from 'src/app/models/classes/validator';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  // Stores any validation errors that occur during user registration.
  formError: FormError = null;

  // Stores the information that is required of a user to register with the Chat System.
  form: RegistrationForm = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    avatar: ""
  }

  constructor(private route: Router, private databaseService: DatabaseService, private messageService: MessageService) { }

  ngOnInit(): void {
  }

  // Registers a new user with the Chat System. (Adds the user to localStorage at the current time.)
  register(): void {
    this.formError = new Validator(this.form).validate([
      { property: "username", rules: ["required"] },
      { property: "email", rules: ["required", "email"] },
      { property: "password", rules: ["required", "password"] },
      { property: "confirmPassword", rules: ["required", "password"] },
    ]);

    if (!this.formError.hasErrors()) {
      this.databaseService.checkIfUsernameIsTaken(this.form.username).subscribe(result => {
        if (!result) {
          this.databaseService.register(this.form).subscribe(result => {
            this.messageService.setMessage(result.message, result.ok ? "success" : "error");
            this.resetForm();
          });
        } else {
          this.messageService.setMessage("Username has been taken", "error");
        }
      });
    }
  }

  // Redirects the user back to the home page 
  cancel(): void {
    this.route.navigateByUrl('/');
    this.resetForm();
  }

  // Resets the form fields.
  resetForm(): void {
    Object.keys(this.form).forEach(field => {
      this.form[field] = "";
    });
  }

  // Formats the form field names to be more user friendly, more noticable in camel case property names.
  // e.g. Captilizes the first character (username -> Username)
  // e.g. Splits two words (confirmPassword -> Confirm Password)
  formatFieldName(field:string): string {
    let str = field;
    for (let i = 0; i < field.length; i++) {
      if (i == 0) {
        str = `${str[i].toUpperCase()}${str.substr(i + 1, str.length)}`;
      }
      else if(field[i] == field[i].toUpperCase()) {
        str = `${str.substr(0, i)} ${field.substr(i, field.length)}`;
      }
    }
    return str;
  }
}
