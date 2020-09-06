import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { Group } from '../models/interfaces/group';
import { Subject, of, BehaviorSubject } from 'rxjs';
import { Channel } from 'src/app/models/interfaces/channel';
import { AuthenticationService } from './authentication.service';
import { MessageService } from './message.service';
import { User } from '../models/classes/user';
import { SocketService } from './socket.service';
import { GroupForm } from '../chat/chat-dashboard/main-panel/add-group/add-group.component';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private channel: Channel = null;
  
  private channels = new BehaviorSubject<Array<Channel>>([]);
  private onlineUsers = new BehaviorSubject<Array<Array<User>>>([]);
  private hasJoinedGroup = new Subject<boolean>();
  private hasToggledGroupManagement = new Subject();
  private hasToggledAddGroup = new Subject();
  private hasJoinedChannel = new Subject<Channel>();

  public groups$ = new BehaviorSubject<Group[]>(null);
  public group$ = new BehaviorSubject<Group>(null);


  channels$ = this.channels.asObservable();
  onlineUsers$ = this.onlineUsers.asObservable();

  hasJoinedGroup$ = this.hasJoinedGroup.asObservable();
  hasToggledGroupManagement$ = this.hasToggledGroupManagement.asObservable();
  hasToggledAddGroup$ = this.hasToggledAddGroup.asObservable();
  hasJoinedChannel$ = this.hasJoinedChannel.asObservable();

  constructor(private databaseService: DatabaseService, private auth: AuthenticationService, private messageService: MessageService,
    private socketService: SocketService) {
  }

  // Gets all active groups
  public getAllGroups() {
    this.databaseService.getAllGroups().subscribe(groups => {
      this.groups$.next(groups);
    });
  }

  // Adds a new group 
  public addGroup(group: GroupForm, channels: string[]) {
    this.databaseService.addGroup(group, channels).subscribe(response => {
      if (response.ok) {
        this.getAllGroups();
      }
      this.messageService.setMessage(response.message, response.ok ? "success" : "error");
    }); 
  }

  // Soft deletes (sets inactive) a group 
  public removeGroup(group: Group) {
    this.databaseService.removeGroup(group).subscribe(response => {
      if (response.ok) {
        this.getAllGroups();
      }
      this.messageService.setMessage(response.message, response.ok ? "success" : "error");
    });
  }

  // Connects to a group and lets subscribed components know that a group has been joined.
  public connectToGroup(group: Group) {
    // Tell subscribed components what group was joined.
    this.group$.next(group);
  }




  async getChannels() {
    return new Promise<Channel[]>((resolve, reject) => {
      this.databaseService.getGroupChannels(this.group$.value._id).subscribe(channels => {
          resolve(channels);
      });
    });
  }

  // async attemptToJoinChannel(channel: Channel) {
  //   if (this.channel) {
  //     await this.leaveChannel();
  //   }
  //   this.databaseService.canJoinChannel(channel._id, this.auth.user._id).subscribe(canJoin => {
  //     if(canJoin.ok) {
  //       this.joinChannel(channel).then(result => {
  //         if (result) {
  //           this.getOnlineUsers(this.channels.value);
  //         }
  //       });
  //     } else {
  //       this.messageService.setMessage(canJoin.message, "error");
  //     }
  //   });
  // }

  async joinChannel(channel: Channel) {
      this.databaseService.joinChannel(channel._id, this.auth.user._id).subscribe(joined => {
        if (joined.ok) {
          this.hasJoinedChannel.next(channel);
          this.channel = channel;
          this.messageService.setMessage(joined.message, "info");
        } else {
          this.messageService.setMessage(joined.message, "error");
        }
      });
  }

  getOnlineUsers(channels: Array<Channel>) {
    let allUsers = [];
    channels.map(channel => {
      let users = [];
      channel.users.map(user => {
        if (user.connected) {
          this.databaseService.getUser(user.user).subscribe(response => {
            console.log(response);
            users.push(response);
          });
        }
      });
      allUsers.push(users);
    });
    console.log(allUsers);
    this.onlineUsers.next(allUsers);
  }

  async leaveChannel() {
    this.databaseService.leaveChannel(this.channel._id, this.auth.user._id).subscribe(response => {
      this.hasJoinedChannel.next(null);
      this.channel = null;
    });
  }

  toggleAddGroup(): void {
    this.hasToggledAddGroup.next();
  }

  getChannel(): Channel {
    return this.channel;
  }

  getMessages(channel: string) {
    
  }

  addChannel(name: string): void {
    
  }

  toggleGroupManagement(): void {
    this.hasToggledGroupManagement.next();
  }
}
