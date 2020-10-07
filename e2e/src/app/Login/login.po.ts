import { browser, by, element } from 'protractor';

export class LoginPage {

  private credentials = {
    username: 'brendon',
    password: '123'
  }

  public navigateTo() {
    return browser.get('/login');
  }

  public getTitle() {
    return element(by.css('app-login h1')).getText();
  }

  public enterUserCredentials(userCredentials: any = this.credentials) {
    return new Promise((resolve, reject) => {
      element(by.css('[name="form.username"]')).sendKeys(userCredentials.username);
      element(by.css('[name="form.password"]')).sendKeys(userCredentials.password);

      resolve(element(by.css('[type="submit"]')).click());
    });
  } 

  public getErrorMessage(allErrors: boolean = false) {
    if (allErrors) {
      return element.all(by.css('.text-red-500')).map(element => {
        return element.getText();
      });
    }

    return element(by.css('.text-red-500')).getText();
  }
}