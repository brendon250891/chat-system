import { LoginPage } from './login.po';
import { MessageComponent } from '../message/message.po';

describe('Login Page e2e Testing', () => {
  let page: LoginPage;
  let message: MessageComponent;

  let incorrectCredentials;

  beforeEach(() => {
    page = new LoginPage();
    message = new MessageComponent();
    incorrectCredentials = {
      username: 'incorrect',
      password: 'incorrect'
    };
  });

  it('should display an error message when the incorrect credentials are used', () => {
    page.navigateTo();
    page.enterUserCredentials(incorrectCredentials);

    expect(page.getTitle()).toEqual('Login');
    expect(message.getLastMessage()).toEqual("Invalid user credentials given");
  });

  it('should display an error if username is missing', () => {
    incorrectCredentials.username = '';

    page.navigateTo();
    page.enterUserCredentials(incorrectCredentials);

    expect(page.getTitle()).toEqual('Login');
    expect(page.getErrorMessage()).toEqual('Username is required');
  });

  it('should display an error if password is missing', () => {
    incorrectCredentials.password = '';

    page.navigateTo();
    page.enterUserCredentials(incorrectCredentials);

    expect(page.getTitle()).toEqual('Login');
    expect(page.getErrorMessage()).toEqual('Password is required');
  });

  it('should display an error if both username and password are missing', () => {
    incorrectCredentials.username = '';
    incorrectCredentials.password = '';

    page.navigateTo();
    page.enterUserCredentials(incorrectCredentials);

    expect(page.getTitle()).toEqual('Login');
    expect(page.getErrorMessage(true)).toEqual(['Username is required', 'Password is required']);
  });
});