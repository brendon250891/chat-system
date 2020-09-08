import { Component, OnInit } from '@angular/core';
import { GroupService } from 'src/app/services/group.service';
import { Group } from 'src/app/models/interfaces/group';
import { Channel } from 'src/app/models/interfaces/channel';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { SocketService } from 'src/app/services/socket.service';
import { Subscription, Observable } from 'rxjs';
import { User } from 'src/app/models/classes/user';
import { DatabaseService } from 'src/app/services/database.service';
import { MessageService } from 'src/app/services/message.service';

const SERVER = 'http://localhost:3000';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css'], 
})
export class GroupComponent implements OnInit {
  // The current group that the user has joined.
  group: Group = null;

  // The channels that exist within the group.
  channels: Array<Channel> = [];

  // Online users for each channel
  onlineUsers: Array<Array<User>> = [];

  // Flag that indicates the user to show options for.
  showOptionsFor: number = null;

  // Flag that indicates whether or not to show options.
  displayOptions: boolean = false;

  // 
  hasNewMessages: boolean = false;

  // Stores any subscriptions for easy clean up.
  subscriptions: Array<Subscription> = [];

  userConnected: Subscription = null;

  userDisconnected: Subscription = null;

  constructor(private groupService: GroupService, private auth: AuthenticationService, private socketService: SocketService,
    private databaseService: DatabaseService, private messageService: MessageService) { 
  }

  ngOnInit(): void {
    this.subscriptions.push(this.groupService.group$.subscribe(group => {
      this.group = group;
    }));
    this.subscriptions.push(this.groupService.channels$.subscribe(channels => {
      this.channels = channels;
    }));
    this.subscriptions.push(this.groupService.onlineUsers$.subscribe(onlineUsers => {
      this.onlineUsers = onlineUsers;
    }));
    this.userConnected?.unsubscribe();
    this.userConnected = this.groupService.onJoinedChannel().subscribe(data => {
      console.log("hit connect");
      this.groupService.channel$.next(data[0]);
      this.groupService.refresh(this.group);
    });
    this.userDisconnected?.unsubscribe();
    this.userDisconnected = this.groupService.onLeftChannel().subscribe(data => {
      console.log("hit disconnect");
      this.groupService.channel$.next(null);
      this.groupService.refresh(this.group);
    });
  }

  // Clean up
  ngOnDestroy(): void {
    this.subscriptions.map(subscription => {
      subscription.unsubscribe();
    });
    this.userConnected.unsubscribe();
    this.userDisconnected.unsubscribe();
  }

  public joinChannel(channel: Channel) {
    this.groupService.joinChannel(channel);
  }

  public leaveGroup(): void {
    this.groupService.connectToGroup(null);
  }

  public toggleOptions(value: number) {
    this.displayOptions = !this.displayOptions;
    this.showOptionsFor = this.displayOptions ? value : null;
  }

  public isAdmin(user: User): boolean {
    if (user.role == 'Super Admin' || user.role == 'Group Admin') {
      return true;
    }

    let isAssistant = false;
    this.group.assistants.map(assistant => {
      if (assistant == user._id) {
        isAssistant = true;
      }
    });

    return isAssistant;
  }
}
