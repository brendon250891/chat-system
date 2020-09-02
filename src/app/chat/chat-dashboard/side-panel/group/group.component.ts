import { Component, OnInit } from '@angular/core';
import { GroupService } from 'src/app/services/group.service';
import { Group } from 'src/app/models/interfaces/group';
import { Channel } from 'src/app/models/interfaces/channel';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { SocketService } from 'src/app/services/socket.service';
import { Subscription, Observable } from 'rxjs';
import { User } from 'src/app/models/classes/user';
import { ChannelService } from 'src/app/services/channel.service';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {
  group: Group = null;

  channels: Array<Channel> = [];

  onlineUsers: Array<Array<User>> = null;

  showOptionsFor: number = null;

  displayOptions: boolean = false;

  hasNewMessages: boolean = false;

  subscriptions: Array<Subscription> = [];

  constructor(private groupService: GroupService, private auth: AuthenticationService, private socketService: SocketService,
  private channelService: ChannelService) { }

  ngOnInit(): void {
    this.subscriptions.push(this.socketService.group$.subscribe(group => {
      this.group = group;
    }))
    this.subscriptions.push(this.socketService.channels$.subscribe(channels => {
      this.channels = channels;
    }));
    this.subscriptions.push(this.socketService.onlineUsers$.subscribe(users => {
      this.onlineUsers = users;
    }));
    this.subscriptions.push(this.socketService.joinedChannel$.subscribe(joined => {
      if (joined) {
        this.subscriptions.push(this.socketService.userConnected().subscribe(() => {
          this.socketService.refreshServer();
        }));
      }
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.map(subscription => {
      subscription.unsubscribe();
    });
  }

  leaveGroupChat(): void {
    this.socketService.leaveGroup();
  }

  joinChannel(channel: Channel) {
    this.socketService.connectToChannel(channel);
    //this.groupService.joinChannel(channel);
  }

  toggleOptions(value: number) {
    this.displayOptions = !this.displayOptions;
    this.showOptionsFor = this.displayOptions ? value : null;
  }

  hasPrivileges(name: string): boolean {
    if (this.auth.user.role == "Super Admin" || this.auth.user.role == "Group Admin") {
      return true;
    }

    let hasPrivileges = false;
    this.group.administrators.map(admin => {
      if (admin == this.auth.user.username) {
        hasPrivileges = true;
      }
    });

    return hasPrivileges;
  }
}
