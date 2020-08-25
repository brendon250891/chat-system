import { Component, OnInit } from '@angular/core';
import { Message } from 'src/app/models/interfaces/channel';
import { Channel } from 'src/app/models/classes/channel';
import { GroupService } from 'src/app/services/group.service';
import { DatabaseService } from 'src/app/services/database.service';
import { User } from 'src/app/models/classes/user';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css']
})
export class ChatWindowComponent implements OnInit {

  messages: Array<Message> = [];

  channel: Channel = null;

  message: string = "";
  
  constructor(private groupService: GroupService, private database: DatabaseService, private auth: AuthenticationService) { }

  ngOnInit(): void {
    this.channel = this.groupService.getChannel();
    this.messages = this.groupService.getMessages(this.channel.getName());
  }

  getUser(name: string): User {
    return this.database.getUser(name);
  }

  isMessageOwner(name: string) {
    return this.auth.user().username == name;
  }
}
