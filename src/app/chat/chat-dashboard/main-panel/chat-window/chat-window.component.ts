import { Component, OnInit } from '@angular/core';
import { Message } from 'src/app/models/interfaces/channel';
import { User } from 'src/app/models/classes/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Subscription } from 'rxjs';
import { MessageService } from 'src/app/services/message.service';
import { style, trigger, state, transition, animate } from '@angular/animations';
import { GroupService } from 'src/app/services/group.service';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css'],
  animations: [
    trigger('newMessage', [
      state('show', style({
        opacity: 1
      })),
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1s')
      ])
    ]),

    trigger('oldMessage', [
      state('default', style({
        opacity: 1
      })),

    ])
  ]
})
export class ChatWindowComponent implements OnInit {
  // Holds the channels messages.
  messages: Message[] = [];

  // Binding that holds the message body.
  message: string = "";
  
  // Holds any subscriptions that the component subscribes to for easy cleanup.
  subscriptions: Subscription[] = [];

  // Not sure why this is here.
  room: Subscription = null;

  newMessages: boolean = false;

  constructor(private auth: AuthenticationService, private messageService: MessageService, private groupService: GroupService) { }

  ngOnInit(): void {
    this.subscriptions.push(this.groupService.channel$.subscribe(channel => {
      this.room?.unsubscribe();
      if (channel != null) {
        this.messages = channel.messages;
        this.room = this.groupService.onMessage().subscribe(message => {
          this.newMessages = true;
          this.messages.push(message);
        });
      }
    }));
  }

  ngOnDestroy(): void {
    console.log("destroyed chat-window");
    // Unsubscribe from all subscriptions.
    this.subscriptions.map(subscription => {
      subscription.unsubscribe();
    });
    this.room.unsubscribe();
  }

  getUser(name: string): User {
    return null;
  }

  isOwner(userId: number): boolean {
    return this.auth.user._id == userId;
  }

  sendMessage() {
    if (this.message != "") {
      let channelMessage = {
        user: this.auth.user._id, username: this.auth.user.username, avatar: this.auth.user.avatar,
        message: this.message, sent_at: this.getFormattedDate()
      }
      this.newMessages = true;
      this.groupService.sendMessage(channelMessage);
    } else {
      this.messageService.setMessage("A Message Body is Required to Send a Message", "error");
    }
    this.message = "";
  }

  // Formats the current date and time to a nice user friendly string.
  private getFormattedDate(): string {
    let dateOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    let timeOptions = { hour: 'numeric', minute: 'numeric' };
    let date = new Date();
    return `${new Intl.DateTimeFormat('en-AU', dateOptions).format(date)} ${new Intl.DateTimeFormat('en-AU', timeOptions).format(date)}`;
  }
}
