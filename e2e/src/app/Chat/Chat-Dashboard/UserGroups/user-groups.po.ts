import { browser, by, element } from 'protractor';

export class UserGroups {
  public getGreeting() {
    return element(by.tagName('app-user-groups')).element(by.css('h2')).getText();
  }

  public getUserGroups() {
    return element(by.tagName('app-user-groups')).all(by.css('p')).map(element => {
      return element.getText();
    });
  }
}