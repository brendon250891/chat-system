import { browser, by, element } from 'protractor';

export class AccountSettings {
  private user = {
    username: 'brendon',
    email: 'brendon@chat-system.com',
    avatar: 'placeholder.jpg',
  };

  private password = {
    password: '',
    confirmPassword: ''
  };


  public getWindowTitle() {
    return element(by.tagName('app-account-settings')).element(by.css('h1')).getText();
  }

  public changeUsername(username: string) {
    this.user.username = username;
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
    element(by.css('[name="username"]')).sendKeys(user.username);
    element(by.css('[name="email"]')).sendKeys(user.email);
    element(by.css('[name="avatar"]')).sendKeys(user.avatar);

    
    element.all(by.css('[type="submit"]')).first().click();
  }
}