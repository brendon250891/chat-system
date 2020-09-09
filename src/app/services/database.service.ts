import { Injectable } from '@angular/core';
import { User } from '../models/classes/user';
import { ApplicationData } from '../models/interfaces/applicationData';
import { Message, Channel } from '../models/interfaces/channel';
import { HttpClient } from '@angular/common/http';
import { RegistrationForm, UserForm } from '../models/interfaces/form';
import { group } from '@angular/animations';
import { GroupForm } from '../chat/chat-dashboard/main-panel/add-group/add-group.component';
import { Group } from '../models/interfaces/group';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private storageName = 'chat';
  private storedData: ApplicationData;
  private apiUrl = "http://localhost:3000/api";

  constructor(private http: HttpClient) { 
    // if (localStorage.getItem(this.storageName) == null) {
    //   this.storedData = this.getMockData();
    //   this.saveData();
    // }

    // this.storedData = JSON.parse(localStorage.getItem(this.storageName));
  }

  public login(username: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/login`, { username: username, password: password });
  }

  register(form: RegistrationForm) {
    return this.http.post<any>(`${this.apiUrl}/register`, form);
  }

  public addUser(user: UserForm) {
    return this.http.post<any>(`${this.apiUrl}/add-user`, { user: user });
  }

  public groupExists(group: string) {
    return this.http.post<any>(`${this.apiUrl}/group-exists`, { group: group });
  }

  public addUserToGroup(username: string, group: string) {
    return this.http.post<any>(`${this.apiUrl}/add-user-to-group`, { username: username, group: group });
  }

  public getGroup(groupId: number) {
    return this.http.post<any>(`${this.apiUrl}/get-group`, { groupId: groupId });
  }

  userExists(username: string) {
    return this.http.post<any>(`${this.apiUrl}/user-exists`, { username: username });
  }

  getUser(userId: number = null, username: string = null) {
    return this.http.post<any>(`${this.apiUrl}/get-user`, { userId: userId, username: username });
  }

  public addGroup(groupForm: GroupForm, channels: string[]) {
    return this.http.post<any>(`${this.apiUrl}/add-group`, { groupForm: groupForm, channels: channels });
  }

  public removeGroup(group: Group) {
    return this.http.post<any>(`${this.apiUrl}/remove-group`, { group: group });
  }

  getAllGroups() {
    return this.http.get<any>(`${this.apiUrl}/get-groups`);
  }

  public getAllGroupUsers(groupId: number) {
    return this.http.post<any>(`${this.apiUrl}/get-all-group-users`, { groupId: groupId });
  }

  public getOnlineUsers(groupId: number) {
    return this.http.post<any>(`${this.apiUrl}/get-online-users`, { groupId: groupId });
  }

  public inviteUserToGroup(groupId: number, username: string) {
    return this.http.post<any>(`${this.apiUrl}/invite-user-to-group`, { groupId: groupId, username: username });
  }

  public isUserAlreadyInChannel(channelId: number, username: string) {
    return this.http.post<any>(`${this.apiUrl}/user-in-channel`, { channelId: channelId, username: username });
  }

  public inviteUserToChannel(channelId: number, user: User) {
    return this.http.post<any>(`${this.apiUrl}/invite-user-to-channel`, { channelId: channelId, user: user });
  }

  public getChannels(groupId: number) {
    return this.http.post<any>(`${this.apiUrl}/get-channels`, { groupId: groupId });
  }

  public getRemovedChannels(groupId: number) {
    return this.http.post<any>(`${this.apiUrl}/get-removed-channels`, { groupId: groupId });
  }

  canJoinChannel(channelId: number, userId: number) {
    return this.http.post<any>(`${this.apiUrl}/can-access-channel`, { channelId: channelId, userId: userId });
  }

  joinChannel(channelId: number, userId: number) {
    return this.http.post<any>(`${this.apiUrl}/join-channel`, { channelId: channelId, userId: userId });
  }

  public addChannel(groupId: number, channel: string, users: number[]) {
    return this.http.post<any>(`${this.apiUrl}/add-channel`, { groupId: groupId, channel: channel, users: users });
  }

  public removeChannel(channelId: number) {
    return this.http.post<any>(`${this.apiUrl}/remove-channel`, { channelId: channelId });
  }

  public reactivateChannel(channelId: number) {
    return this.http.post<any>(`${this.apiUrl}/reactivate-channel`, { channelId: channelId });
  }

  public isUserAlreadyInGroup(groupId: number, username: string) {
    return this.http.post<any>(`${this.apiUrl}/user-in-group`, { groupId: groupId, username: username });
  }

  public removeUserFromChannel(channelId: number, user: User) {
    return this.http.post<any>(`${this.apiUrl}/remove-user-from-channel`, { channelId: channelId, user: user });
  }

  public removeUserFromGroup(groupId: number, user: User) {
    return this.http.post<any>(`${this.apiUrl}/remove-user-from-group`, { groupId: groupId, user: user });
  }

  public promoteUserToGroupAssistant(group: Group, user: User) {
    return this.http.post<any>(`${this.apiUrl}/promote-user-to-group-assistant`, { group: group, user: user });
  }

  public demoteUserFromGroupAssistant(group: Group, user: User) {
    return this.http.post<any>(`${this.apiUrl}/demote-user-from-group-assistant`, { group: group, user: user });
  }

  public reactivateGroup(group: Group) {
    return this.http.post<any>(`${this.apiUrl}/reactivate-group`, { group: group });
  }

  leaveChannel(channelId: number, userId: number) {
    return this.http.post<any>(`${this.apiUrl}/leave-channel`, { channelId: channelId, userId: userId });
  }

  getUserGroups(username: string) {
    return this.http.post<any>(`${this.apiUrl}/get-user-groups`, { username: username });
  }

  getOnlineChannelUsers(groupId: number) {
    return this.http.post<any>(`${this.apiUrl}/get-online-channel-users`, { groupId: groupId });
  }

  getChannelMessages(channelId: number) {
    return this.http.post<any>(`${this.apiUrl}/get-messages`, { channelId: channelId });
  }

  saveMessage(channelId: number, message: Message) {
    return this.http.post<any>(`${this.apiUrl}/save-message`, { channelId: channelId, message: message });
  }

  updateUser(user: User) {
    return this.http.post<any>(`${this.apiUrl}/update-user`, { user: user });
  }

  updatePassword(userId: number, newPassword: string) {
    return this.http.post<any>(`${this.apiUrl}/update-password`, { userId: userId, newPassword: newPassword})
  }

  // OLD database methods

  saveData(): void {
    localStorage.setItem(this.storageName, JSON.stringify(this.storedData));
  }

  // addUser(username: string, email: string, password: string, avatar: string): void {
  //   this.storedData.users.push(new User(username, email, password, avatar));
  //   this.saveData();
  // }

//   updatePassword(username: string, password: string): void {
// //    this.getUser(username).password = password;
//     this.saveData();
//   }

  getAllUsers(): Array<User> {
    return this.storedData.users;
  }

  // getUser(username: string = "", password: string = ""): User {
  //   return this.storedData.users.find(user => {
  //     return password != "" ? user.username == username && user.password == password : user.username == username;
  //   });
  // }

  // updateUser(user: User) {
  //   this.storedData.users.map(u => {
  //     if (u.username == user.username) {
  //       u = user;
  //     }
  //   });
  //   this.saveData();
  // }

  // getAllGroups(): Array<Group> {
  //   return this.storedData.groups;
  // }

  // getGroup(name: string): Group {
  //   return this.storedData.groups.find(group => {
  //     return group.name == name;
  //   });
  // }

  // getGroupChannels(name: string): Array<Channel> {
  //   return this.getGroup(name).channels;
  // }

  // getChannel(group: string, channel: string): Channel {
  //   return this.getGroup(group).channels.find(c => {  
  //     return c.getName() == channel;
  //   });
  // }

  // getChannelMessages(group: string, channel: string): Array<Message> {
  //   return this.getChannel(group, channel).getMessages();
  // }

  // addChannel(group: string, name: string): void {
  //   this.getGroup(group).channels.push(new Channel(name, new Array(), new Array()));
  // }

  // private getMockData(): ApplicationData {
  //   return { 
  //     users: [
  //       { username: 'Super', email: 'admin@chat-system.com', password: '123', role: "Super Admin", avatar: "headshot.jpg", groups: [] },
  //       { username: 'Brendon', email: 'brendon@chat-system.com', password: '123', role: "", avatar: "placeholder.jpg", 
  //         groups: [ "NRL" ]
  //       },
  //       { username: 'Jane', email: 'jane@chat-system.com', password: '123', role: "", avatar: "mel.jpg", 
  //         groups: [ "Newcastle Knights Fans"],
  //       },
  //       { username: 'John', email: 'john@chat-system.com', password: '123', role: "", avatar: "steve.jpg",
  //         groups: [],
  //       },
  //       { username: 'Wayne', email: 'wayne@chat-system.com', password: '123', role: "Group Admin", avatar: "placeholder.jpg",
  //         groups: [ "NRL" ],
  //       },
  //       { username: 'Justin', email: 'justin@chat-system.com', password: '123', role: "Group Admin", avatar: "placeholder.jpg",
  //         groups: [ "Newcastle Knights Fans" ],
  //       },
  //       { username: 'Jose', email: 'jose@chat-system.com', password: '123', role: "Group Admin", avatar: "placeholder.jpg",
  //         groups: [ "EPL" ],
  //       },
  //     ],
  //     groups: [
  //       { 
  //         avatar: 'nrl.png', name: 'NRL', 
  //         description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean vestibulum non diam non laoreet. \
  //           Sed iaculis quam eget semper mattis. Aliquam erat volutpat.', 
  //         administrators: [ "Wayne" ], 
  //         channels: [
  //           new Channel('General Chat', new Array( 
  //             { username: "Brendon", connected: true },
  //             { username: "Jane", connected: false },
  //             { username: "Wayne", connected: false },
  //           ), 
  //           new Array(
  //             { user: "Brendon", message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean vestibulum non diam non laoreet. \
  //             Sed iaculis quam eget semper mattis. Aliquam erat volutpat.", timestamp: new Date() },
  //             { user: "Jane", message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean vestibulum non diam non laoreet. \
  //             Sed iaculis quam eget semper mattis. Aliquam erat volutpat.", timestamp: new Date() },
  //             { user: "Brendon", message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean vestibulum non diam non laoreet. \
  //             Sed iaculis quam eget semper mattis. Aliquam erat volutpat.", timestamp: new Date() },
  //             { user: "Wayne", message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean vestibulum non diam non laoreet. \
  //             Sed iaculis quam eget semper mattis. Aliquam erat volutpat.", timestamp: new Date() },
  //           )
  //           )
  //         ]
  //       },
  //       { 
  //         avatar: 'nk.png', name: 'Newcastle Knights Fans', 
  //         description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean vestibulum non diam non laoreet. \
  //           Sed iaculis quam eget semper mattis. Aliquam erat volutpat.',
  //         administrators: [ "Justin" ],
  //         channels: [
  //           new Channel("Upcoming Games", new Array({ username: "Jane", connected: false}), new Array()),
  //         ]
  //       },
  //       { 
  //         avatar: 'epl.png', name: 'EPL', 
  //         description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean vestibulum non diam non laoreet. \
  //           Sed iaculis quam eget semper mattis. Aliquam erat volutpat.',
  //         administrators: [ "Jose" ],
  //         channels: [
  //           new Channel("Arsenal Fans", new Array(), new Array())
  //         ]
  //       },
  //     ],
  //     roles: [
  //       { name: 'Super Admin' },
  //       { name: 'Group Admin' },
  //       { name: 'Group Assist'}
  //     ]
  //   }
  // }
}
