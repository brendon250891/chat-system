import { Injectable } from '@angular/core';
import { Channel } from '../models/interfaces/channel';
import { User } from 'src/app/models/classes/user';
import { DatabaseService } from './database.service';
import { SocketService } from './socket.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {
  public channels$: BehaviorSubject<Channel[]> = new BehaviorSubject(null);
  public onlineUsers$: BehaviorSubject<User[][]> = new BehaviorSubject(null);
  public userConnected$: BehaviorSubject<boolean> = new BehaviorSubject(false);


  constructor(private socketService: SocketService, private databaseService: DatabaseService) { 

  }

  
}
