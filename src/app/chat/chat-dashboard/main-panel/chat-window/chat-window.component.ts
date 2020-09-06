import { Component, OnInit } from '@angular/core';
import { Message } from 'src/app/models/interfaces/channel';
import { Channel } from 'src/app/models/interfaces/channel';
import { User } from 'src/app/models/classes/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { SocketService } from 'src/app/services/socket.service';
import { Subscription } from 'rxjs';
import { MessageService } from 'src/app/services/message.service';
import { style, trigger, state, transition, group, query, animate } from '@angular/animations';

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

  // The current channel that is joined.
  channel: Channel = null;

  // Binding that holds the message body.
  message: string = "";
  
  // Holds any subscriptions that the component subscribes to for easy cleanup.
  subscriptions: Subscription[] = [];

  // Not sure why this is here.
  room: Subscription = null;

  newMessages: boolean = false;

  constructor(private socketService: SocketService, private auth: AuthenticationService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.subscriptions.push(this.socketService.channel$.subscribe(channel => {
      this.channel = channel;
      if (channel != null) {
        this.room?.unsubscribe();
        this.messages = channel.messages;
        this.room = this.socketService.onMessage().subscribe(message => {
          this.newMessages = true;
          this.messages.push(message);
        });
      }
      console.log(this.newMessages);
    }));
  }

  ngOnDestroy(): void {
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
      this.socketService.sendMessage(channelMessage);
    } else {
      this.messageService.setMessage("A Message Body is Required to Send a Message", "error");
    }
    this.message = "";
  }

  private joinedChannel() {
    console.log("hit joined channel in chat-window");
        if (this.room) {
          this.room.unsubscribe();
        }
        this.room = this.socketService.onMessage().subscribe(message => {
          this.messages.push(message);
        });
        // get previous messages
        this.socketService.getMessages().then(messages => {
          this.messages = messages;
        });
  }

  // Formats the current date and time to a nice user friendly string.
  private getFormattedDate(): string {
    let dateOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    let timeOptions = { hour: 'numeric', minute: 'numeric' };
    let date = new Date();
    return `${new Intl.DateTimeFormat('en-AU', dateOptions).format(date)} ${new Intl.DateTimeFormat('en-AU', timeOptions).format(date)}`;
  }
}
