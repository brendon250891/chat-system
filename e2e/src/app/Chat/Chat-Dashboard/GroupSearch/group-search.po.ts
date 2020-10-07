import { browser, by, element } from 'protractor';

export class GroupSearch {
  public getCurrentSearch() {
    return element(by.tagName('app-group-search')).element(by.css('h3')).getText();
  }

  public getGroupNames() {
    return element.all(by.repeater('let group of allGroups').column('group.name'));
  }
}