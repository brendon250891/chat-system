import { Injectable } from '@angular/core';
import { User } from '../models/classes/user';
import { Group } from '../models/interfaces/group';
import { ApplicationData } from '../models/interfaces/applicationData';
import { Message } from '../models/interfaces/channel';
import { Channel } from 'src/app/models/classes/channel';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private storageName = 'chat';
  private storedData: ApplicationData;

  constructor() { 
    if (localStorage.getItem(this.storageName) == null) {
      this.storedData = this.getMockData();
      this.saveData();
    }

    this.storedData = JSON.parse(localStorage.getItem(this.storageName));
  }

  saveData(): void {
    localStorage.setItem(this.storageName, JSON.stringify(this.storedData));
  }

  addUser(username: string, email: string, password: string, avatar: string): void {
    this.storedData.users.push(new User(username, email, password, avatar));
    this.saveData();
  }

  updatePassword(username: string, password: string): void {
    this.getUser(username).password = password;
    this.saveData();
  }

  getAllUsers(): Array<User> {
    return this.storedData.users;
  }

  getUser(username: string = "", password: string = ""): User {
    return this.storedData.users.find(user => {
      return password != "" ? user.username == username && user.password == password : user.username == username;
    });
  }

  updateUser(user: User) {
    this.storedData.users.map(u => {
      if (u.username == user.username) {
        u = user;
      }
    });
    this.saveData();
  }

  getUserGroups(username: string): Array<Group> {
    let groups: Array<Group> = [];
    this.getUser(username).groups.map(group => {
      groups.push(this.getGroup(group));
    });
    return groups;
  }

  addGroup(name: string) {
    this.storedData.groups.push();
  }

  getAllGroups(): Array<Group> {
    return this.storedData.groups;
  }

  getGroup(name: string): Group {
    return this.storedData.groups.find(group => {
      return group.name == name;
    });
  }

  getGroupChannels(name: string): Array<Channel> {
    return this.getGroup(name).channels;
  }

  getChannel(group: string, channel: string): Channel {
    return this.getGroup(group).channels.find(c => {  
      return c.getName() == channel;
    });
  }

  getChannelMessages(group: string, channel: string): Array<Message> {
    return this.getChannel(group, channel).getMessages();
  }

  addChannel(group: string, name: string): void {
    this.getGroup(group).channels.push(new Channel(name, new Array(), new Array()));
  }

  private getMockData(): ApplicationData {
    return { 
      users: [
        { username: 'Super', email: 'admin@chat-system.com', password: '123', role: "Super Admin", avatar: "headshot.jpg", groups: [] },
        { username: 'Brendon', email: 'brendon@chat-system.com', password: '123', role: "", avatar: "placeholder.jpg", 
          groups: [ "NRL" ]
        },
        { username: 'Jane', email: 'jane@chat-system.com', password: '123', role: "", avatar: "mel.jpg", 
          groups: [ "Newcastle Knights Fans"],
        },
        { username: 'John', email: 'john@chat-system.com', password: '123', role: "", avatar: "steve.jpg",
          groups: [],
        },
        { username: 'Wayne', email: 'wayne@chat-system.com', password: '123', role: "Group Admin", avatar: "placeholder.jpg",
          groups: [ "NRL" ],
        },
        { username: 'Justin', email: 'justin@chat-system.com', password: '123', role: "Group Admin", avatar: "placeholder.jpg",
          groups: [ "Newcastle Knights Fans" ],
        },
        { username: 'Jose', email: 'jose@chat-system.com', password: '123', role: "Group Admin", avatar: "placeholder.jpg",
          groups: [ "EPL" ],
        },
      ],
      groups: [
        { 
          avatar: 'nrl.png', name: 'NRL', 
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean vestibulum non diam non laoreet. \
            Sed iaculis quam eget semper mattis. Aliquam erat volutpat.', 
          administrators: [ "Wayne" ], 
          channels: [
            new Channel('General Chat', new Array( 
              { username: "Brendon", connected: true },
              { username: "Jane", connected: false },
              { username: "Wayne", connected: false },
            ), 
            new Array(
              { user: "Brendon", message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean vestibulum non diam non laoreet. \
              Sed iaculis quam eget semper mattis. Aliquam erat volutpat.", timestamp: new Date() },
              { user: "Jane", message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean vestibulum non diam non laoreet. \
              Sed iaculis quam eget semper mattis. Aliquam erat volutpat.", timestamp: new Date() },
              { user: "Brendon", message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean vestibulum non diam non laoreet. \
              Sed iaculis quam eget semper mattis. Aliquam erat volutpat.", timestamp: new Date() },
              { user: "Wayne", message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean vestibulum non diam non laoreet. \
              Sed iaculis quam eget semper mattis. Aliquam erat volutpat.", timestamp: new Date() },
            )
            )
          ]
        },
        { 
          avatar: 'nk.png', name: 'Newcastle Knights Fans', 
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean vestibulum non diam non laoreet. \
            Sed iaculis quam eget semper mattis. Aliquam erat volutpat.',
          administrators: [ "Justin" ],
          channels: [
            new Channel("Upcoming Games", new Array({ username: "Jane", connected: false}), new Array()),
          ]
        },
        { 
          avatar: 'epl.png', name: 'EPL', 
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean vestibulum non diam non laoreet. \
            Sed iaculis quam eget semper mattis. Aliquam erat volutpat.',
          administrators: [ "Jose" ],
          channels: [
            new Channel("Arsenal Fans", new Array(), new Array())
          ]
        },
      ],
      roles: [
        { name: 'Super Admin' },
        { name: 'Group Admin' },
        { name: 'Group Assist'}
      ]
    }
  }
}
