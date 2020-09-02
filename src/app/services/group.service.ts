import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { Group } from '../models/interfaces/group';
import { Subject, of, BehaviorSubject } from 'rxjs';
import { Channel } from 'src/app/models/interfaces/channel';
import { AuthenticationService } from './authentication.service';
import { MessageService } from './message.service';
import { User } from '../models/classes/user';
import { ThrowStmt } from '@angular/compiler';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private channel: Channel = null;
  
  private group = new BehaviorSubject<Group>(null);
  private channels = new BehaviorSubject<Array<Channel>>([]);
  private onlineUsers = new BehaviorSubject<Array<Array<User>>>([]);
  private hasJoinedGroup = new Subject<boolean>();
  private hasToggledGroupManagement = new Subject();
  private hasToggledAddGroup = new Subject();
  private hasJoinedChannel = new Subject<Channel>();

  group$ = this.group.asObservable();
  channels$ = this.channels.asObservable();
  onlineUsers$ = this.onlineUsers.asObservable();

  hasJoinedGroup$ = this.hasJoinedGroup.asObservable();
  hasToggledGroupManagement$ = this.hasToggledGroupManagement.asObservable();
  hasToggledAddGroup$ = this.hasToggledAddGroup.asObservable();
  hasJoinedChannel$ = this.hasJoinedChannel.asObservable();

  constructor(private database: DatabaseService, private auth: AuthenticationService, private messageService: MessageService,
    private socketService: SocketService) { }

  async connectToGroup(group: Group) {
    this.hasJoinedGroup.next(true);
    this.group.next(group);
    await this.getChannels().then(channels => {
      this.channels.next(channels);
      this.socketService.connectToChannel(channels[0]);
      //this.joinChannel(channels[0]);
    });
  }

  async getChannels() {
    return new Promise<Channel[]>((resolve, reject) => {
      this.database.getChannels(this.group.value._id).subscribe(channels => {
          resolve(channels);
      });
    });
  }

  async attemptToJoinChannel(channel: Channel) {
    if (this.channel) {
      await this.leaveChannel();
    }
    this.database.canJoinChannel(channel._id, this.auth.user._id).subscribe(canJoin => {
      if(canJoin.ok) {
        this.joinChannel(channel).then((result) => {
          console.log(result);
          if (result) {
            this.getOnlineUsers(this.channels.value);
          }
        });
      } else {
        this.messageService.setMessage(canJoin.message, "error");
      }
    });
  }

  async joinChannel(channel: Channel) {
    return new Promise((resolve, reject) => {
      (this.database.joinChannel(channel._id, this.auth.user._id).subscribe(joined => {
        if (joined.ok) {
          this.hasJoinedChannel.next(channel);
          this.channel = channel;
          this.messageService.setMessage(joined.message, "info");
          resolve(true);
        } else {
          this.messageService.setMessage(joined.message, "error");
          reject(false);
        }
      }));
    });
  }

  getOnlineUsers(channels: Array<Channel>) {
    let allUsers = [];
    channels.map(channel => {
      let users = [];
      channel.users.map(user => {
        if (user.connected) {
          this.database.getUser(user.user).subscribe(response => {
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
    this.database.leaveChannel(this.channel._id, this.auth.user._id).subscribe(response => {
      this.hasJoinedChannel.next(null);
      this.channel = null;
    });
  }

  leaveGroup(): void {
    this.hasJoinedGroup.next(false);
    this.group = null;
    this.channels = null;
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
