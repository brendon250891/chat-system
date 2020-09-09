export interface RegistrationForm {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    avatar: string;
  }

export interface AccountForm {
  username: string;
  email: string;
  avatar: string;
}

export interface PasswordForm {
  newPassword: string;
  confirmNewPassword: string;
}

export interface UserForm {
  username: string;
  email: string;
  avatar: string;
  password: string;
  role: string;
}