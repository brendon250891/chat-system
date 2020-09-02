import { Injectable, resolveForwardRef } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable, BehaviorSubject } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { User } from '../models/classes/user';
import { Channel, Message } from '../models/interfaces/channel';
import { Group } from '../models/interfaces/group';
import { DatabaseService } from './database.service';
import { MessageService } from './message.service';
import { ThrowStmt } from '@angular/compiler';

const SERVER = 'http://localhost:3000';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: SocketIOClient.Socket;
  private channel: Channel;

  public group$ = new BehaviorSubject(null);
  public channels$: BehaviorSubject<Channel[]> = new BehaviorSubject(null);
  public onlineUsers$: BehaviorSubject<User[][]> = new BehaviorSubject(null);
  public userConnected$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public joinedChannel$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private auth: AuthenticationService, private databaseService: DatabaseService, private messageService: MessageService) { }

  ngOnDestroy(): void {
    console.log("Destroyed Socket Service");
  }

  public async connectToGroup(group: Group) {
    this.group$.next(group);
    await this.setChannels().then(() => {
      this.connectToChannel(this.channels$.value[0]);
      this.setOnlineUsers();
    });
  }

  public leaveGroup() {
    this.leaveChannel().then(() => {
      this.joinedChannel$.next(true);
      this.group$.next(null);
      this.channels$.next(null);
      this.channel = null;
      this.socket = null;
    });
  }

  public connectToChannel(channel: Channel) {
    this.canAccessChannel(channel).then(async hasAccess => {
      if (hasAccess) {
        if (this.channel) {
          await this.leaveChannel();
        }
        this.databaseService.joinChannel(channel._id, this.auth.user._id).subscribe(response => {
          this.channel = channel;
          this.socket = io(`${SERVER}`);
          this.socket.emit('joinChannel', { channelId: channel._id, channelName: channel.name });
          this.socket.emit('userConnected', this.auth.user);
          this.joinedChannel$.next(true);
          this.messageService.setMessage(response.message, response.ok ? "info" : "error");      
        });
      }
    });
  }

  public sendMessage(message: Message) {
    // if (message.user == this.auth.user._id) {
      // this.databaseService.saveMessage(this.channel._id, message);
      this.socket.emit('message', message);
    // }
  }

  public async getMessages(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.databaseService.getChannelMessages(this.channel._id).subscribe(messages => {
        resolve(messages);
      });
    });
  }

  public userConnected(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('userConnected', (data: User) => {      
        observer.next(data);
      });
    });
  }

  public onMessage(): Observable<any> {
    return new Observable(observer => {
      this.socket.on(`${this.channel._id}-message`, (message: Message) => {
        this.saveMessage(message).then(() => {
          observer.next(message);
        })        
      });
    });
  }

  public refreshServer() {
    this.setChannels().then(() => {
      this.setOnlineUsers();
    });
  }

  private async leaveChannel() {
    this.databaseService.leaveChannel(this.channel._id, this.auth.user._id).subscribe(response => {
    });
  }

  private async canAccessChannel(channel: Channel): Promise<any> {
    return new Promise((resolve, reject) => {
      this.databaseService.canJoinChannel(channel._id, this.auth.user._id).subscribe(response => {
        this.messageService.setMessage(response.message, response.ok ? "info" : "error");
        resolve(response.ok);
      });
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

  private async setOnlineUsers(): Promise<any> {
    return new Promise((resolve, reject) => {
      let onlineGroupUsers = [];
      this.channels$.value.map(channel => {
        let channelUsers = [];
        channel.users.map(user => {
          if (user.connected) {
            this.databaseService.getUser(user.user).subscribe(user => {
              console.log(user);
              channelUsers.push(user);
            });
          }
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
        this.databaseService.saveMessage(this.channel._id, message).subscribe(result => {
        });
      }
      resolve(true);
    });
  }
}
