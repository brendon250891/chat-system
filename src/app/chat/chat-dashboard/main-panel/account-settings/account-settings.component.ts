import { Component, OnInit } from '@angular/core';
import { RoomService } from 'src/app/services/room.service';
import { User } from '../../../../models/classes/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DatabaseService } from 'src/app/services/database.service';
import { FormError } from 'src/app/models/classes/formError';
import { AccountForm, PasswordForm } from '../../../../models/interfaces/form';
import { Validator } from 'src/app/models/classes/validator';
import { Subscription } from 'rxjs';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.css']
})
export class AccountSettingsComponent implements OnInit {
  errors: FormError = null;

  user: User;

  accountForm: AccountForm = {
    username: "",
    email: "",
    avatar: ""
  }

  passwordForm: PasswordForm = {
    newPassword: "",
    confirmNewPassword: ""
  }

  passwordFieldType = "password";

  subscriptions: Subscription[] = [];

  constructor(private roomService: RoomService, private auth: AuthenticationService, private database: DatabaseService,
  private messageService: MessageService) { }

  ngOnInit(): void {
    this.user = this.auth.user;
    this.setAccountInput();
  }

  ngOnDestroy(): void {
    this.subscriptions.map(subscription => {
      subscription.unsubscribe();
    });
  }

  toggleAccountSettings(): void {
    this.roomService.toggleAccountSettings();
  }

  updateAccountDetails(): void {
    this.errors = new Validator(this.accountForm).validate([
      { property: "username", rules: ["required"] },
      { property: "email", rules: ["required", "email"] },
    ]);

    if (!this.errors.hasErrors() && this.detailsHaveChanged()) {
      this.checkUserExists().then(userExists => {
        if (!userExists) {
          this.user.username = this.accountForm.username;
          this.user.email = this.accountForm.email;
          this.user.avatar = this.accountForm.avatar;
          this.subscriptions.push(this.database.updateUser(this.user).subscribe(response => {
            this.messageService.setMessage(response.message, response.ok ? "success" : "error");
          }));
        }
      });
      this.errors = null;
    }
  }
  
  public checkUserExists() {
    return new Promise((resolve, reject) => {
      this.database.userExists(this.accountForm.username, this.user._id).subscribe(response => {
        if (response.ok) {
          this.messageService.setMessage(response.message, "error");
        }
        resolve(response.ok);
      });
    });
  }

  resetAccountDetails(): void {
    this.setAccountInput();
  }

  changePassword(): void {
    this.errors = new Validator(this.passwordForm).validate([
      { property: 'newPassword', rules: ["required", "password"] },
      { property: 'confirmNewPassword', rules: ["required", "password"] }
    ]);

    if (!this.errors.hasErrors()) {
      this.subscriptions.push(this.database.updatePassword(this.user._id, this.passwordForm.newPassword).subscribe(response => {
        this.messageService.setMessage(response.message, response.ok ? "success" : "error");
      }));
      this.resetPasswordFields();
      this.errors = null;
    }
  }

  resetPasswordFields(): void {
    this.passwordForm.newPassword = "";
    this.passwordForm.confirmNewPassword = "";
  }

  toggleViewPassword(): void {
    this.passwordFieldType = this.passwordFieldType == "text" ? "password" : "text";
  }

  private setAccountInput(): void {
    this.accountForm.username = this.user.username;
    this.accountForm.email = this.user.email;
    this.accountForm.avatar = this.user.avatar;
  }

  private detailsHaveChanged(): boolean {
    return this.accountForm.username != this.user.username || this.accountForm.email != this.user.email || this.accountForm.avatar != this.user.avatar;
  }
}