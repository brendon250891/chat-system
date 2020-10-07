import { Component, OnInit } from '@angular/core';
import { MessageService } from 'src/app/services/message.service';
import { Subscription } from 'rxjs';
import { trigger, state, animate, transition, style} from '@angular/animations';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css'],
  animations: [
    trigger('showHide', [
      state('show', style({
        opacity: 1,
      })),

      state('hide', style({
        opacity: 0,
      })),

      transition('hide => show', [
        animate('.25s')
      ]),
    ])
  ]
})
export class MessageComponent implements OnInit {

  // The message to display 
  public message: string = "";

  // The last message that was set (Used in testing)
  public lastMessage: string = "";

  // The type of the message (error, success, info)
  public type: string = "";
  
  // The background color to set the message box
  public background: string = "";

  // Any subscriptions
  public subscriptions: Array<Subscription> = [];

  // Flag indicating if the message should be shown
  public show: boolean = true;

  constructor(private messageService: MessageService) { }

  /**
   * Do any setup here
   */
  ngOnInit(): void {
    this.subscriptions.push(this.messageService.message$.subscribe(m => {
      this.message = m;
      this.show = true;
    }));

    this.subscriptions.push(this.messageService.type$.subscribe(t => {
      this.type = t;
      this.background = this.setBackground();
      setTimeout(() => {
        this.show = false;
      }, 3000);
    }));
  }
  
  /**
   * Do any teardown here
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  /**
   * Gets the background color to use
   */
  setBackground(): string {
    return this.type == "error" ? 'bg-red-500' : this.type == "info" ? 'bg-blue-500' : 'bg-green-500';
  }

  /**
   * Checks if there is a message
   */
  hasMessage(): boolean {
    return this.message != "";
  }
  
  /**
   * Gets the type of message
   */
  getType(): string {
    return `${this.type.substring(0, 1).toUpperCase()}${this.type.substring(1)}`;
  }

  /**
   * Set the message visibility to false
   */
  hideMessage(): void {
    this.show = false;
  }

  getLastMessage(): string {
    return this.messageService.getLastMessage();
  }
}
