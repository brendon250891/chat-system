import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  isLoggedIn: boolean = false;

  constructor() { }

  login(username: string, password: string): boolean {
    let allUsers = this.getUsers();
    console.log(allUsers);
    allUsers.map(user => {
      if (user.username == username && user.password == password) {
        this.isLoggedIn = true;
        sessionStorage.setItem('user', JSON.stringify(user));
      }
    });
    return this.isLoggedIn;
  }

  private getUsers(): Array<User> {
    return JSON.parse(localStorage.getItem('chat')).users;
  }
}


interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  role: number;
  avatar: string;
}

interface StoredData {
  users: Array<User>;
}