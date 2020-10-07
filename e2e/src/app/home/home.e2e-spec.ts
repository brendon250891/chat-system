import { HomePage } from './home.po';
import { AppRoot } from '../app.po';
describe('home page e2e testing', () => {
  let page: HomePage;
  let appRoot: AppRoot;

  beforeEach(() => {
    page = new HomePage();
    appRoot = new AppRoot();
  });

  it('when a user naviagtes to the home page then the home page is displayed with correct navigation', () => {
    page.navigateTo();

    expect(page.getSectionTitles()).toEqual(['Welcome to Chat', 'Groups']);
    expect(appRoot.getNavigationLinks()).toEqual(['Home', 'Chat', 'Signup']);
  });

});