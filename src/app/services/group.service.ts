import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { DatabaseService } from './database.service';
import { Group } from '../models/interfaces/group';
import { Subject, of, BehaviorSubject, Observable } from 'rxjs';
import { Channel, Message } from 'src/app/models/interfaces/channel';
import { AuthenticationService } from './authentication.service';
import { MessageService } from './message.service';
import { User } from '../models/classes/user';
import { SocketService } from './socket.service';
import { GroupForm } from '../chat/chat-dashboard/main-panel/add-group/add-group.component';

const SERVER = 'http://localhost:3000';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private socket: SocketIOClient.Socket;
  
  private hasToggledGroupManagement = new Subject();
  private hasToggledAddGroup = new Subject();
  private hasJoinedChannel = new Subject<Channel>();

  public groups$ = new BehaviorSubject<Group[]>(null);
  public channel$ = new BehaviorSubject<Channel>(null);
  public channels$ = new BehaviorSubject<Array<Channel>>([]);
  public group$ = new BehaviorSubject<Group>(null);
  public addGroup$ = new BehaviorSubject<boolean>(false);
  public onlineUsers$ = new BehaviorSubject<Array<Array<User>>>([]);
  public connectedToGroup$ = new BehaviorSubject<boolean>(null);

  // EVERYTHING ABOUT A GROUP + ALL GROUPS FOR EASE


  // channels$ = this.channels.asObservable();
  hasToggledGroupManagement$ = this.hasToggledGroupManagement.asObservable();
  hasToggledAddGroup$ = this.hasToggledAddGroup.asObservable();
  hasJoinedChannel$ = this.hasJoinedChannel.asObservable();

  constructor(private databaseService: DatabaseService, private auth: AuthenticationService, private messageService: MessageService,
    private socketService: SocketService) {
  }

  // Set the value of the group observable and notify all observers.
  public async connectToGroup(group: Group) {
    this.socket = io.connect(SERVER);
    this.group$.next(group);
    this.setChannels(group).then(async () => {
      await this.joinChannel(null);
    }).then(() => {
      this.setOnlineUsers(group);
    });
  }

  public joinChannel(channel: Channel) {
    return new Promise((resolve, reject) => {
      let chan = channel ?? this.channels$.value[0];
      this.databaseService.canJoinChannel(chan._id, this.auth.user._id).subscribe(async canJoin => {
        if (canJoin.ok || this.auth.isAdmin()) {
          if (this.channel$.value != null) {
            await this.leaveChannel();
          }
          this.databaseService.joinChannel(chan._id, this.auth.user._id).subscribe(joined => {
            if (joined.ok) {
              this.channel$.next(chan);
              this.socket.emit('joinChannel', chan, this.auth.user);
            }
            this.messageService.setMessage(joined.message, joined.ok ? "success" : "error");
            resolve();
          });
        }
      });
    });
  }

  public leaveChannel() {
    return new Promise((resolve, reject) => {
      this.databaseService.leaveChannel(this.channel$.value._id, this.auth.user._id).subscribe(response => {
        this.channel$.next(null);
        resolve(this.socket.emit('leaveChannel', this.channel$.value, this.auth.user));
      });
    });
  }

  public leaveGroup() {
    this.leaveChannel().then(() => {
      this.group$.next(null);
    });
  }

  public setOnlineUsers(group: Group) {
    new Promise((resolve, reject) => {
      this.databaseService.getOnlineUsers(group._id).subscribe(onlineUsers => {
        console.log(onlineUsers);
        resolve(this.onlineUsers$.next(onlineUsers));
      });
    });
  }

  // Gets a groups channesl from the database and sets the channels observable notifying all observers.
  public setChannels(group: Group) {
    return new Promise((resolve, reject) => {
      this.databaseService.getChannels(group._id).subscribe(channels => {
        this.channels$.next(channels);
        resolve();
      });
    });
  }

  // Refreshes the channels when a user connects / disconnects.
  public refresh(group: Group) {
    // this.setChannels(group).then(() => {
      this.setOnlineUsers(group);
    // })
  }

  // Retrieves all online users in the currently joined group.
  public getOnlineUsers() {
    this.databaseService.getOnlineUsers(this.group$.value._id).subscribe(onlineUsers => {
      this.onlineUsers$.next(onlineUsers);
    })
  }

  // // Sets the channel, if the users has just joined then join 'General Chat' otherwise the given channel.
  // public setChannel(channel: Channel) {
  //   this.socketService.joinChannel(channel ?? this.channels$.value[0]);
  // }

  // Retrieves all the channels for a group.
  public getChannels(group: Group) {
    this.databaseService.getChannels(group._id).subscribe(channels => {
      this.channels$.next(channels);
    });
  }

  // Listen for the 'joinedChannel' event from the socket.
  public onJoinedChannel() {
    return new Observable(observer => {
      this.socket.on('joinChannel', (data: any) => {
        observer.next(data);
      });
    });
  }

  public onLeftChannel() {
    return new Observable(observer => {
      this.socket.on('leaveChannel', (data: any) => {
        observer.next(data);
      });
    });
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

  // Hooks into messages emitted by the socket.
  public onMessage(): Observable<any> {
    return new Observable(observer => {
      // When the 'message' event is fired from the socket, inform observers.
      this.socket.on('message', (message: Message) => {
          observer.next(message);
      });
    });
  }

  public sendMessage(message: Message) {
    if (message.user == this.auth.user._id) {
      this.saveMessage(message).then(() => {
        this.socket.emit('message', message);
      });
    }
  }

  private async saveMessage(message: Message): Promise<any> {
    return new Promise((resolve, reject) => {
      this.databaseService.saveMessage(this.channel$.value._id, message).subscribe(result => {
        resolve(true);
      }); 
    });
  }

  public async getMessages(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.channel$.value) {
        this.databaseService.getChannelMessages(this.channel$.value._id).subscribe(messages => {
          resolve(messages);
        });
      }
    });
  }

  toggleAddGroup(): void {
    this.hasToggledAddGroup.next();
  }

  addChannel(name: string): void {
    
  }

  toggleGroupManagement(): void {
    this.hasToggledGroupManagement.next();
  }
}
