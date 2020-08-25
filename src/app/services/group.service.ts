import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { Group } from '../models/interfaces/group';
import { ChannelUser } from '../models/interfaces/channel';
import { Subject, VirtualTimeScheduler } from 'rxjs';
import { Channel } from 'src/app/models/classes/channel';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private group: Group = null;
  private channels: Array<Channel> = null;
  private channel: Channel = null;
  private hasJoinedGroup = new Subject<boolean>();
  private hasToggledGroupManagement = new Subject();
  private hasToggledAddGroup = new Subject();
  private hasJoinedChannel = new Subject<Channel>();

  hasJoinedGroup$ = this.hasJoinedGroup.asObservable();
  hasToggledGroupManagement$ = this.hasToggledGroupManagement.asObservable();
  hasToggledAddGroup$ = this.hasToggledAddGroup.asObservable();
  hasJoinedChannel$ = this.hasJoinedChannel.asObservable();

  constructor(private database: DatabaseService) { }

  joinGroup(group: Group): void {
    this.hasJoinedGroup.next(true);
    this.group = group;
    this.channels = group.channels;
  }

  joinChannel(channel: Channel): void {
    this.hasJoinedChannel.next(channel);
    this.channel = channel;
  }

  leaveGroup(): void {
    this.hasJoinedGroup.next(false);
    this.group = null;
    this.channels = null;
  }

  toggleAddGroup(): void {
    this.hasToggledAddGroup.next();
  }

  getGroup(): Group {
    return this.group;
  }

  getChannel(): Channel {
    return this.channel;
  }

  getChannels(): Array<Channel> {
    return this.channels;
  }

  getMessages(channel: string) {
    return this.database.getChannel(this.group.name, channel).getMessages();
  }

  addChannel(name: string): void {
    this.database.addChannel(this.group.name, name);
  }

  toggleGroupManagement(): void {
    this.hasToggledGroupManagement.next();
  }
}
