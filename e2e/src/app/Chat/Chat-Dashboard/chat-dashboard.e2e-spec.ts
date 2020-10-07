import { LoginPage } from '../../Login/login.po';
import { ChatDashboardPage } from './chat-dashboard.po';
import { UserGroups } from './UserGroups/user-groups.po';
import { GroupSearch } from './GroupSearch/group-search.po';
import { AccountSettings } from './AccountSettings/account-settings.po';
import { MessageComponent } from './../../Message/message.po';

describe('Dashboard Page e2e Testing', () => {
  let page: ChatDashboardPage;
  let loginPage: LoginPage;
  let userGroupPage: UserGroups;
  let groupSearchPage: GroupSearch;
  let accountSettingsPage: AccountSettings;
  let message: MessageComponent;

  beforeAll(() => {
    page = new ChatDashboardPage();
    loginPage = new LoginPage();
    userGroupPage = new UserGroups();
    groupSearchPage = new GroupSearch();
    accountSettingsPage = new AccountSettings();

    page.navigateTo();
    loginPage.enterUserCredentials();
  });

  beforeEach(() => {
    message = new MessageComponent();
  })

  it('should display the users groups', async () => {    
    expect(userGroupPage.getGreeting()).toEqual('Hi, brendon');
    expect(userGroupPage.getUserGroups()).toEqual(['NRL']);
  });

  it('should display the current search', () => {
    expect(groupSearchPage.getCurrentSearch()).toEqual("Showing results for: All");
  });

  /**
   * Account Settings
   */
  it('should display the change account details page when the person icon is clicked', () => {
    page.openAccountSettings();

    expect(accountSettingsPage.getWindowTitle()).toEqual('User Account Settings');
    expect(accountSettingsPage.getSubTitles()).toEqual(['General Information', 'Password']);
  });

  it('should have the correct inputs and initial values', () => {
    expect(accountSettingsPage.getInputNames()).toEqual(['username', 'email', 'avatar', 'newPassword', 'confirmPassword']);    
  }); 

  it('should display an error when trying to change username to one already taken', () => {
    accountSettingsPage.changeUsername("mel");
    accountSettingsPage.changeDetails();

    expect(message.getLastMessage()).toEqual(`'mel' is Already in Use`);
  });

  it('should display success when a user successfully updates their account details', () => {
    accountSettingsPage.changeUsername('brendon');
    accountSettingsPage.changeEmail("brendon@chat-system.com.au");
    accountSettingsPage.changeDetails();

    expect(message.getLastMessage()).toEqual('Successfully Updated Your Account Details');
  });

  it('should display errors if passwords are not given when changing', () => {
    accountSettingsPage.changePassword({ password: '', confirmPassword: '' });

    expect(accountSettingsPage.getErrors(true)).toEqual(['New Password is required', 'Confirm New Password is required']);
  });

  it('should display errors if new password is not given', () => {
    accountSettingsPage.changePassword({ password: '', confirmPassword: 'changed' });

    expect(accountSettingsPage.getErrors(true)).toEqual(['New Password is required', 'Passwords are not a match', 'Passwords are not a match']);
  });

  it('should display success if password is changed', () => {
    accountSettingsPage.changePassword();

    expect(message.getLastMessage()).toEqual('Successfully Changed Your Password');
  });
});