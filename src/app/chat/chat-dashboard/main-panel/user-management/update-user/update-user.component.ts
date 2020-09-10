import { Component, OnInit } from '@angular/core';
import { FormError } from 'src/app/models/classes/formError';
import { UserForm } from 'src/app/models/interfaces/form';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit {
  public errors: FormError = null;

  public username: string = "";

  public userForm: UserForm = {
    username: "",
    email: "",
    avatar: "",
    password: "",
    role: "",
    active: null,
  };


  constructor(private auth: AuthenticationService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.resetForm();
  }
  
  public findUser() {
    if (this.username != "") {
      this.auth.findUser(this.username)
        .catch(error => {
          this.messageService.setMessage(error, "error");
        })
        .then((user: UserForm) => {
        if (user) {
          this.userForm = user;
        }
      }).catch(error => {
        this.messageService.setMessage(error, "error");
      });
    } else {
      this.messageService.setMessage("A Username is Required to Find a User", "error");
    }
  }

  public deactivateUser() {
    if (this.userForm.username != "") {
      this.auth.deactivateUser(this.userForm.username)
        .then(response => {
          this.messageService.setMessage(response, "success");
          this.resetForm();
        })
        .catch(error => {
          this.messageService.setMessage(error, "error");
        });
    }
  }

  public activateUser() {
    if (this.userForm.username != "") {
      this.auth.activateUser(this.userForm.username)
        .then(response => {
          this.messageService.setMessage(response, "success");
          this.resetForm();
        })
        .catch(error => {
          this.messageService.setMessage(error, "error");
        })
    }
  }

  public cancel() {
    this.resetForm();
  }

  private resetForm() {
    this.username = "";
    Object.keys(this.userForm).map(key => {
      if (key == "active") {
        this.userForm[key] = null;
      } else {
        this.userForm[key] = "";
      }
    });
  }
}
