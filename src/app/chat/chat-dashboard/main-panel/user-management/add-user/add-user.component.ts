import { Component, OnInit } from '@angular/core';
import { FormError } from 'src/app/models/classes/formError';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserForm } from 'src/app/models/interfaces/form';
import { Validator } from 'src/app/models/classes/validator';
import { DatabaseService } from 'src/app/services/database.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  // Holds any errors in the form
  public errors: FormError = null;

  public userForm: UserForm = {
    // Binding for the username of the user.
    username: "",

    // Binding for the email for the user.
    email: "",

    // Binding foor the role of the user.
    role: "",

    // Binding for the users avatar.
    avatar: "placeholder.jpg",

    // Binding for the users password.
    password: '123'
  }
  
  // Binding for adding the user to groups.
  public group: string = "";

  // List of groups that the user is to be added too.
  public groups: string[] = [];

  constructor(private messageService: MessageService, private auth: AuthenticationService, private databaseService: DatabaseService) { }

  ngOnInit(): void {
  }

  // Add a group to the list of groups.
  public addGroup() {
    this.databaseService.groupExists(this.group).subscribe(response => {
      if (!response.ok) {
        this.messageService.setMessage(response.message, "error");
      } else {
        this.groups.push(this.group);
      }
      this.group = "";
    });

  }

  isSuperAdmin(): boolean {
    return this.auth.user.role == "Super Admin";
  }

  public addUser(): void {
    this.errors = new Validator(this.userForm).validate([
      { property: 'username', rules: ['required'] },
      { property: 'email', rules: ['required', 'email'] },
    ]);

    if (!this.errors.hasErrors()) {
      this.auth.addUser(this.userForm, this.groups)
        .then(() => this.reset());
    }
  }

  public reset(): void {
    this.userForm.username = "";
    this.userForm.email = "";
    this.group = "";
    this.groups = [];
  }
}
