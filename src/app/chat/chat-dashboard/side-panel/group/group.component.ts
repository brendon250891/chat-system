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

  constructor(private groupService: GroupService, private auth: AuthenticationService, private socketService: SocketService ) { }

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
    this.subscriptions.push(this.socketService.joinedChannel$.subscribe());
  }

  ngOnDestroy(): void {
    console.log("Group destroy being called");
    this.subscriptions.map(subscription => {
      subscription.unsubscribe();
    });
  }

  public leaveGroup(): void {
    this.socketService.leaveGroup();
  }

  public joinChannel(channel: Channel) {
    this.socketService.connectToChannel(channel);
    //this.groupService.joinChannel(channel);
  }

  public toggleOptions(value: number) {
    this.displayOptions = !this.displayOptions;
    this.showOptionsFor = this.displayOptions ? value : null;
  }

  public isAdmin(user: User): boolean {
    if (user.role == 'super' || user.role == 'group') {
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

  public getRole(user: User): string {
    return user.role;
  }
}
