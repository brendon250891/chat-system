import { browser, by, element } from 'protractor';

export class AppRoot {

  getNavigationLinks() {
    return element(by.css('app-root nav')).all(by.css('a')).map(element => {
      return element.getText();
    });
  }
}