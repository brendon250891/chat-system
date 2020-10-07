import { browser, by, element } from 'protractor';

export class ChatDashboardPage {

  public navigateTo() {
    browser.driver.manage().window().maximize();
    return browser.get('/dashboard');
  }

  public openAccountSettings() {
    return element(by.css('[name="toggleAccountSettings"]')).click();
  }
}