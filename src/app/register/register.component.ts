import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';


interface Form {
  username:string;
  email:string;
  password:string;
  confirmPassword:string;
  avatar:string;
}

interface StoredData {
  users:Array<Form>;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  
  // Stores the information that is required of a user to register with the Chat System.
  form:Form = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    avatar: ""
  }

  // Stores any validation errors that are detected when trying to register.
  validation:Object = {};

  constructor(private route: Router, private http: HttpClient) { }

  ngOnInit(): void {
  }

  // Registers a new user with the Chat System. (Adds the user to localStorage at the current time.)
  register(): void {
    this.validate();
    console.log(this.validation);
    if (Object.keys(this.validation).length == 0) {
      // save data to localStorage
      // let storedData:StoredData = JSON.parse(localStorage.getItem('chat'));
      // storedData.users.push(this.form);
      // localStorage.setItem('chat', JSON.stringify(storedData));
      this.http.post('http://localhost:3000/register', this.form).subscribe(response => {
        
      });
      this.resetForm();
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

  // Does some simple client side form validation such as checking for empty values and ensuring that the given 
  // passwords are a match.
  validate(): void {
    this.validation = {};
    Object.keys(this.form).forEach(field => {
      if (this.form[field] == "" && field != 'avatar') {
        this.validation[field] = `${this.formatFieldName(field)} is a required field.`;
      }
    });
    if (!this.validation['password'] && this.form.password != this.form.confirmPassword) {
      let message = "Passwords entered do not match.";
      this.validation['password'] = message;
      this.validation['confirmPassword'] = message;
    }
    let pattern = new RegExp("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$", "g");
    if (!this.validation['email'] && !pattern.test(this.form.email)) {
      this.validation['email'] = "Invalid email has been entered.";
    }
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
