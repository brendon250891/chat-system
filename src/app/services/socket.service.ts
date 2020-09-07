import { Injectable } from '@angular/core';
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
        //this.leaveGroup();
      }
    });
    this.socket = io(SERVER);
  }

  ngOnDestroy(): void {
    console.log("Destroyed Socket Service");
  }

  // SINGLE CHANNEL

  // Join the specified socket channel.
  public joinChannel(channel: Channel) {
    this.socket.emit('joinChannel', channel, this.auth.user);
  }

  // Checks if the user is in a channel
  public isInChannel(): boolean {
    return this.channel$.value != null;
  }


  public leaveChannel() {
    return new Promise((resolve, reject) => {
      resolve(this.databaseService.leaveChannel(this.channel$.value._id, this.auth.user._id).subscribe(response => {
        this.socket.emit('leaveChannel', this.channel$.value, this.auth.user);
        this.channel$.next(null);
        this.messageService.setMessage(response.message, "info");
      }));
    });
  }

  // Check if the user has access to the channel that they are trying to join.
  private canJoinChannel(channel: Channel): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.auth.isAdmin()) {
        resolve({ ok: true });
      } else {
        this.databaseService.canJoinChannel(channel._id, this.auth.user._id).subscribe(response => {
          resolve(response);
        });
      }
    });
  }

  public toggleAddGroup() {
    this.addGroup$.next(!this.addGroup$.value);
  }

  // public sendMessage(message: Message) {
  //   if (message.user == this.auth.user._id) {
  //     this.saveMessage(message).then(() => {
  //       this.socket.emit('message', message);
  //     });
  //   }
  // }

  public async getMessages(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.channel$.value) {
        this.databaseService.getChannelMessages(this.channel$.value._id).subscribe(messages => {
          resolve(messages);
        });
      }
    });
  }





}
