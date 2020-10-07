import { Injectable } from '@angular/core';
import { User } from '../models/classes/user';
import { MessageService } from './message.service';
import { Subject } from 'rxjs';
import { DatabaseService } from './database.service';
import { UserForm } from '../models/interfaces/form';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  // Stores the current user that is logged in
  private currentUser = new Subject<User>();
  
  // Flag to indicate if the user is logged in
  private isLoggedIn = new Subject<boolean>();

  isLoggedIn$ = this.isLoggedIn.asObservable();
  currentUser$ = this.currentUser.asObservable();

  // Stores the user object.
  user: User = null;

  constructor(private messageService: MessageService, private databaseService: DatabaseService) { }

  /**
   * Attempts to log the user in by checking credentials supplied against ones in database
   * @param username - The username of the account the user is trying to login to
   * @param password - The password associated with that username
   */
  public login(username: string, password: string) {
    this.databaseService.login(username, password).subscribe(response => {
      if (response.ok) {
        this.user = response.user;
        this.currentUser.next(response.user);
        this.isLoggedIn.next(true);
      } else {
        this.messageService.setMessage(response.message, "error");
      }
    }, error => {
      this.messageService.setMessage(error.error, "error");
    });
  }

  /**
   * Logs out a user
   */
  public logout() {
    this.isLoggedIn.next(false);
    this.currentUser.next(null);
  }

  /**
   * Checks if the user is a Super Admin or Group Admin
   */
  public isAdmin(): boolean {
    return this.user.role == "Super Admin" || this.user.role == "Group Admin";
  }

  /**
   * Adds a user to the system along with any groups that are passed.
   * @param user - The user object with user deatils to add
   * @param groups - Any groups that the user should be added to
   */
  public addUser(user: UserForm, groups: string[]) {
    return this.userExists(user.username)
      .then(() => {
        return new Promise((resolve, reject) => {
          this.databaseService.addUser(user).subscribe(response => {
            response.ok ? resolve() : reject(response.message);
          });
        });
      })
      .then(() => {
        groups.map(group => {
          this.databaseService.addUserToGroup(user.username, group).subscribe(response => {
            this.messageService.setMessage(response.message, response.ok ? "success" : "error");
          });
        });
      })
      .catch(error => {
        this.messageService.setMessage(error, "error");
      });
  }

  /**
   * Finds a user given their username
   * @param username - The name of the user to find
   */
  public findUser(username: string) {
    return new Promise((resolve, reject) => {
      this.databaseService.getUser(null, username).subscribe(response => {
        response.ok ? resolve(response.user) : reject(response.message);
      });
    }).catch(error => {
      this.messageService.setMessage(error, "error");
    });
  }

  /**
   * Deactivates a users account
   * @param username - The name of the user to deactivate
   */
  public deactivateUser(username: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.databaseService.deactivateUser(username).subscribe(response => {
        response.ok ? resolve(response.message) : reject(response.message); 
      });
    });
  }

  /**
   * Activates a users account
   * @param username - The name of the user to activate
   */
  public activateUser(username: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.databaseService.activateUser(username).subscribe(response => {
        response.ok ? resolve(response.message) : reject(response.message);
      });
    });
  }

  /**
   * Checks if a user exists
   * @param username The name of the user to check
   */
  private userExists(username: string) {
    return new Promise((resolve, reject) => {
      this.databaseService.userExists(username).subscribe(response => {
        response.ok ? reject(response.message) : resolve(false);
      });
    });
  }
}