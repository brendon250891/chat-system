import { browser, by, element } from 'protractor';

export class RegisterPage {
  private correctRegistrationDetails = {
    username: 'james',
    email: 'james@chat-system.com',
    password: '123',
    confirmPassword: '123'
  };

  public navigateTo() {
    return browser.get('/register');
  }

  public getTitle() {
    return element(by.css('app-register h1')).getText();
  }

  public getUsername() {
    return this.correctRegistrationDetails.username;
  }

  public useRegisteredUsername() {
    this.correctRegistrationDetails.username = 'brendon';
  }

  public enterRegistrationDetails(registrationDetails: any = this.correctRegistrationDetails) {
    element(by.css('[name="form.username"]')).sendKeys(registrationDetails.username);
    element(by.css('[name="form.email"]')).sendKeys(registrationDetails.email);
    element(by.css('[name="form.password"]')).sendKeys(registrationDetails.password);
    element(by.css('[name="form.confirmPassword"]')).sendKeys(registrationDetails.confirmPassword);

    element(by.css('[type="submit"]')).click();
  }

  public getErrors(allErrors: boolean = false) {
    if (allErrors) {
      return element.all(by.css('.text-red-500')).map(element => {
        return element.getText();
      });
    }

    return element(by.css('.text-red-500')).getText();
  }
}