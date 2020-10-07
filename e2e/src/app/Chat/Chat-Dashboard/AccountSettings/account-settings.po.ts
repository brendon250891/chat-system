import { browser, by, element } from 'protractor';
import { ObjectUnsubscribedError } from 'rxjs';

export class AccountSettings {
  private user = {
    username: 'brendon',
    email: 'brendon@chat-system.com',
    avatar: 'placeholder.jpg',
  };

  private password = {
    password: 'changed',
    confirmPassword: 'changed'
  };

  public getWindowTitle() {
    return element(by.tagName('app-account-settings')).element(by.css('h1')).getText();
  }

  public changeUsername(username: string) {
    Object.keys(this.user).map(key => {
      this.user[key] = key == 'username' ? username : this.user[key];
    })
    
  }

  public changeEmail(email: string) {
    this.user.email = email;
  }

  public getSubTitles() {
    return element(by.tagName('app-account-settings')).all(by.css('h2')).map(element => {
      return element.getText();
    });
  }

  public getInputNames() {
    return element(by.tagName('app-account-settings')).all(by.css('.input')).map(element => {
      return element.getAttribute('name');
    });
  }

  public changeDetails(user: any = this.user) {
    this.clearDetails();
    element(by.css('[name="username"]')).sendKeys(user.username);
    element(by.css('[name="email"]')).sendKeys(user.email);
    element(by.css('[name="avatar"]')).sendKeys(user.avatar);

    
    element.all(by.css('[type="submit"]')).first().click();
  }

  public changePassword(password: any = this.password) {
    this.clearPasswords();
    element(by.css('[name="newPassword"]')).sendKeys(password.password);
    element(by.css('[name="confirmPassword"]')).sendKeys(password.confirmPassword);

    element.all(by.css('[type="submit"]')).last().click();

  }

  public getErrors(all: boolean = false) {
    if (all) {
      return element.all(by.css('.text-red-500')).map(element => {
        return element.getText();
      });
    }

    return element(by.css('.text-red-500')).getText();
  }

  private clearDetails() {
    element(by.css('[name="username"]')).clear();
    element(by.css('[name="email"]')).clear();
    element(by.css('[name="avatar"]')).clear();
  }

  private clearPasswords() {
    element(by.css('[name="newPassword"]')).clear();
    element(by.css('[name="confirmPassword"]')).clear();
  }
}