import { browser, by, element } from 'protractor';

export class HomePage {

  navigateTo() {
    return browser.get('/');
  }

  getSectionTitles() {
    return element.all(by.css('app-home h1')).map(element => {
      return element.getText();
    });
  }
}
