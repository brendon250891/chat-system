import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable, BehaviorSubject } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { User } from '../models/classes/user';
import { Channel, Message } from '../models/interfaces/channel';
import { Group } from '../models/interfaces/group';
import { DatabaseService } from './database.service';
import { MessageService } from './message.service';
import { GroupForm } from '../chat/chat-dashboard/main-panel/add-group/add-group.component';

const SERVER = 'http://localhost:3000';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: SocketIOClient.Socket;

  public addGroup$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public group$ = new BehaviorSubject<Group>(null);
  public channel$ = new BehaviorSubject<Channel>(null);
  public channels$: BehaviorSubject<Channel[]> = new BehaviorSubject(null);
  public deactivatedChannels$: BehaviorSubject<Channel[]> = new BehaviorSubject(null);
  public allGroupUsers$: BehaviorSubject<User[]> = new BehaviorSubject(null);
  public onlineUsers$: BehaviorSubject<User[][]> = new BehaviorSubject(null);
  public userConnected$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public joinedChannel$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public leftChannel$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private auth: AuthenticationService, private databaseService: DatabaseService, private messageService: MessageService) { 
    this.auth.isLoggedIn$.subscribe(loggedIn => {
      if (!loggedIn) {
        this.leaveGroup();
      }
    });
  }

  ngOnDestroy(): void {
    console.log("Destroyed Socket Service");
  }

  public toggleAddGroup() {
    this.addGroup$.next(!this.addGroup$.value);
  }

  public async connectToGroup(group: Group) {
    await this.setGroup(group).then(groupSet => {
      if (groupSet) {
        this.setChannels().then(() => {
          this.getAllGroupUsers();
          this.connectToChannel(this.channels$.value[0]);
          this.setOnlineUsers();
        });
      }
    });
  }

  public async leaveGroup() {
    await this.leaveChannel().then(() => {
      this.refreshServer().then(() => {
        this.group$.next(null);
        this.channel$.next(null);
      });
    });
  }

  public connectToChannel(channel: Channel) {
    this.canAccessChannel(channel).then(async hasAccess => {
      if (hasAccess) {
        if (this.channel$.value) {
          this.socket.emit("userDisconnected", this.auth.user);
          await this.leaveChannel();
        }
        this.databaseService.joinChannel(channel._id, this.auth.user._id).subscribe(response => {
          if (response.ok) {
            this.socket = io(`${SERVER}`);
            this.channel$.next(channel);
            this.socket.emit('joinChannel', { channelId: channel._id, channelName: channel.name });
            this.socket.emit('userConnected', this.auth.user);
            this.joinedChannel$.next(true);
          }
          this.messageService.setMessage(response.message, response.ok ? "info" : "error");      
        });
      }
    });
  }

  public sendMessage(message: Message) {
    if (message.user == this.auth.user._id) {
      this.saveMessage(message).then(() => {
        this.socket.emit('message', message);
      });
    }
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

  public userConnected(): Observable<any> {
    return new Observable(observer => {
      this.socket.on(`${this.channel$.value._id}-userConnected`, (data: User) => {     
        console.log(`Connect: ${data}`);
          observer.next(data);
      });
    });
  }

  public onMessage(): Observable<any> {
    return new Observable(observer => {
      this.socket.on(`${this.channel$.value._id}-message`, (message: Message) => {
        // this.saveMessage(message).then(() => {
          observer.next(message);
        // });   
      });
    });
  }

  public onUserDisconnect(): Observable<any> {
    return new Observable(observer => {
      this.socket.on(`${this.channel$.value._id}-userDisconnected`, (user: User) => {
        console.log(`Disconnected: ${user}`);
        this.refreshServer().then(() => {
          observer.next(user);
        });
      });
    });
  }

  public addGroup(group: GroupForm, channels: string[]) {
    this.databaseService.addGroup(group, channels).subscribe(response => {
      if (response.ok) {
        channels.map(channel => {
          this.databaseService.addChannel(response.insertedId, channel, channel == "General Chat" ? group.users : []).subscribe();
        });
        this.refreshServer();
      }
      this.messageService.setMessage(response.message, response.ok ? "success" : "error");
    });
  }

  public addChannel(channel: string, users: number[]) {
    this.databaseService.addChannel(this.group$.value._id, channel, users).subscribe(response => {
      if (response.ok) {
        this.refreshServer();
      }
      this.messageService.setMessage(response.message, response.ok ? "success" : "error");
    });
  }

  public removeChannel(channelId: number) {
    this.databaseService.removeChannel(channelId).subscribe(response => {
      if (response.ok) {
        this.refreshServer();
      }
      this.messageService.setMessage(response.message, response.ok ? "success" : "error");
    });
  }

  public reactivateChannel(channelId: number) {
    this.databaseService.reactivateChannel(channelId).subscribe(response => {
      if (response.ok) {
        this.refreshServer();
      }
      this.messageService.setMessage(response.message, response.ok ? "success" : "error");
    });
  }

  public inviteUserToChannel(channelId: number, username: string) {
    this.databaseService.inviteUserToChannel(channelId, username).subscribe(response => {
      if (response.ok) {
        this.refreshServer();
      }
      this.messageService.setMessage(response.message, response.ok ? "success" : "error");
    });
  }

  public removeUserFromChannel(channelId: number, user: User) {
    console.log(channelId);
    console.log(user);
    this.databaseService.removeUserFromChannel(channelId, user).subscribe(response => {
      if (response.ok) {
        this.refreshServer();
      }
      this.messageService.setMessage(response.message, response.ok ? "success" : "error");
    });
  }

  public getAllGroupUsers() {
    this.databaseService.getAllGroupUsers(this.group$.value._id).subscribe(allGroupUsers => {
      this.allGroupUsers$.next(allGroupUsers);
      this.refreshServer();
    });
  }

  public async refreshServer(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.setChannels().then(() => {    
        this.setDeactivatedChannels().then(() => {
          this.getAllGroupUsers();
          resolve(this.setOnlineUsers);
        });
      });
    });
  }

  private async setGroup(group): Promise<any> {
    return new Promise((resolve, reject) => {
      this.group$.next(group);
      resolve(group != null);
    });
  }

  private async leaveChannel() {
    this.socket.emit('userDisconnected', this.auth.user);
    this.databaseService.leaveChannel(this.channel$.value._id, this.auth.user._id).subscribe(response => {});
  }

  private async canAccessChannel(channel: Channel): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.channel$.value && this.channel$.value._id == channel._id) {
        this.messageService.setMessage(`You are Already in ${channel.name}`, "error");
      } else {
        if (this.auth.isAdmin()) {
          resolve(true);
        } else {
          this.databaseService.canJoinChannel(channel._id, this.auth.user._id).subscribe(response => {
            this.messageService.setMessage(response.message, response.ok ? "info" : "error");
            resolve(response.ok);
          });
        }
      }
    });
  }

  private async setChannels(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.databaseService.getChannels(this.group$.value._id).subscribe(channels => {
        this.channels$.next(channels);
        resolve(true);
      });
    });
  }

  private async setDeactivatedChannels(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.databaseService.getRemovedChannels(this.group$.value._id).subscribe(channels => {
        this.deactivatedChannels$.next(channels);
      });
    });
  }

  private async setOnlineUsers(): Promise<any> {
    return new Promise((resolve, reject) => {
      let onlineGroupUsers = [];
      this.channels$.value.map(channel => {
        let channelUsers = [];
        channel.connectedUsers.map(user => {
          this.databaseService.getUser(user).subscribe(user => {
            channelUsers.push(user);
          });
        });
        onlineGroupUsers.push(channelUsers);
      });
      this.onlineUsers$.next(onlineGroupUsers);
      resolve(true);
    });
  }

  private async saveMessage(message: Message): Promise<any> {
    return new Promise((resolve, reject) => {
      if (message.user == this.auth.user._id) {
        this.databaseService.saveMessage(this.channel$.value._id, message).subscribe(result => {
        });
      }
      resolve(true);
    });
  }
}
