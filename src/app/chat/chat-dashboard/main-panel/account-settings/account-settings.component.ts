import { Component, OnInit } from '@angular/core';
import { RoomService } from 'src/app/services/room.service';
import { User } from '../../../../models/classes/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DatabaseService } from 'src/app/services/database.service';
import { FormError } from 'src/app/models/classes/formError';
import { AccountForm, PasswordForm } from '../../../../models/interfaces/form';
import { Validator } from 'src/app/models/classes/validator';

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

  constructor(private roomService: RoomService, private auth: AuthenticationService, private database: DatabaseService) { }

  ngOnInit(): void {
    this.user = this.auth.user();
    this.setAccountInput();
  }

  toggleAccountSettings(): void {
    this.roomService.toggleAccountSettings();
  }

  updateAccountDetails(): void {
    this.errors = new Validator(this.accountForm).validate([
      { property: "username", rules: ["required", "unique"] },
      { property: "email", rules: ["required", "email"] },
    ]);

    if (!this.errors.hasErrors()) {
      this.user.username = this.accountForm.username;
      this.user.email = this.accountForm.email;
      this.user.avatar = this.accountForm.avatar;
      this.database.updateUser(this.user);
      this.errors = null;
    }
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
      this.database.updatePassword(this.user.username, this.passwordForm.newPassword);
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
}