import { Component, OnInit } from '@angular/core';
import { GroupService } from 'src/app/services/group.service';
import { Group } from 'src/app/models/interfaces/group';
import { Channel } from 'src/app/models/interfaces/channel';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { SocketService } from 'src/app/services/socket.service';
import { Subscription, Observable } from 'rxjs';
import { User } from 'src/app/models/classes/user';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css'], 
})
export class GroupComponent implements OnInit {
  group: Group = null;

  channels: Array<Channel> = [];

  onlineUsers: Array<Array<User>> = [];

  showOptionsFor: number = null;

  displayOptions: boolean = false;

  hasNewMessages: boolean = false;

  subscriptions: Array<Subscription> = [];

  constructor(private groupService: GroupService, private auth: AuthenticationService, private socketService: SocketService ) { }

  ngOnInit(): void {
    this.subscriptions.push(this.groupService.group$.subscribe(group => {
      this.group = group;
    }));
    this.subscriptions.push(this.socketService.channels$.subscribe(channels => {
      this.channels = channels;
    }));
    this.subscriptions.push(this.socketService.onlineUsers$.subscribe(onlineUsers => {
      this.onlineUsers = onlineUsers;
    }));
    this.subscriptions.push(this.socketService.onUserConnected().subscribe(user => {
      this.socketService.getOnlineUsers(this.group);
    }));

    if (this.group != null) {
      this.viewSetup();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.map(subscription => {
      subscription.unsubscribe();
    });
  }

  // Do any initial setup
  public viewSetup(): void {
    // Set the channels for the group
    this.socketService.getGroupChannels(this.group).then(() => {

      // By default, join general chat on connect
      this.socketService.joinChannel(null).then(() => {

        // Get online users
        this.socketService.getOnlineUsers(this.group);
      });
    }); 
  }


  public leaveGroup(): void {
    this.groupService.connectToGroup(null);
    // this.socketService.leaveChannel();
  }

  public joinChannel(channel: Channel) {
    this.socketService.connectToChannel(channel);
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
