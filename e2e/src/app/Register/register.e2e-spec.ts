import { RegisterPage } from './register.po';
import { MessageComponent } from '../message/message.po';

describe('Register Page e2e testing', () => {
  let page: RegisterPage;
  let message: MessageComponent;
  let incorrectRegistrationDetails;

  beforeEach(() => {
    page = new RegisterPage();
    message = new MessageComponent();
    incorrectRegistrationDetails = {
      username: 'incorrect',
      email: 'incorrect@chat-system.com',
      password: 'incorrect',
      confirmPassword: 'incorrect',
    };
  });

  it('should display an error if no details are provided', () => {
    Object.keys(incorrectRegistrationDetails).map(key => {
      incorrectRegistrationDetails[key] = '';
    });

    page.navigateTo();
    page.enterRegistrationDetails(incorrectRegistrationDetails);

    expect(page.getTitle()).toEqual('Signup');
    expect(page.getErrors(true)).toEqual(['Username is required', 'Email is required', 'Email is an invalid email address', 'Password is required', 'Confirm Password is required']);
  });

  it('should display an error if no username is provided', () => {
    incorrectRegistrationDetails.username = '';

    page.navigateTo();
    page.enterRegistrationDetails(incorrectRegistrationDetails);

    expect(page.getTitle()).toEqual('Signup');
    expect(page.getErrors()).toEqual('Username is required');
  });

  it('should display errors if no email address is provided', () => {
    incorrectRegistrationDetails.email = '';

    page.navigateTo();
    page.enterRegistrationDetails(incorrectRegistrationDetails);

    expect(page.getTitle()).toEqual('Signup');
    expect(page.getErrors(true)).toEqual(['Email is required', 'Email is an invalid email address']);
  });

  it('should display errors if no password is provided', () => {
    incorrectRegistrationDetails.password = '';

    page.navigateTo();
    page.enterRegistrationDetails(incorrectRegistrationDetails);

    expect(page.getTitle()).toEqual('Signup');
    expect(page.getErrors()).toEqual('Password is required');
  });

  it('should display errors if no confirm password is provided', () => {
    incorrectRegistrationDetails.confirmPassword = '';

    page.navigateTo();
    page.enterRegistrationDetails(incorrectRegistrationDetails);

    expect(page.getTitle()).toEqual('Signup');
    expect(page.getErrors(true)).toEqual(['Passwords are not a match', 'Confirm Password is required', 'Passwords are not a match']);
  });

  it('should display an error message when a username that already exists is used', () => {
    page.navigateTo();
    page.useRegisteredUsername();
    page.enterRegistrationDetails();

    expect(page.getTitle()).toEqual('Signup');
    expect(message.getLastMessage()).toEqual(`'${page.getUsername()}' is Already in Use`);
  });

  it('should display success message when a user is registered', () => {
    page.navigateTo();
    page.enterRegistrationDetails();

    expect(page.getTitle()).toEqual('Signup');
    expect(message.getLastMessage()).toEqual(`Successfully created account '${page.getUsername()}'`);
  });
});