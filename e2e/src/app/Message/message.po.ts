import { browser, by, element } from 'protractor';

export class MessageComponent {

  public getLastMessage() {
    return element(by.tagName('app-root')).element(by.tagName('app-message')).element(by.css('[name="lastMessage"]')).getAttribute("value");
  }
}