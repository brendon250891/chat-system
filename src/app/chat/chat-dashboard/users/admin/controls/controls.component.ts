import { Component, OnInit } from '@angular/core';
import { GroupService } from 'src/app/services/group.service';
import { Channel } from 'src/app/models/interfaces/channel';
import { DatabaseService } from 'src/app/services/database.service';
import { MessageService } from 'src/app/services/message.service';
import { User } from 'src/app/models/classes/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Group } from 'src/app/models/interfaces/group';
import { Subscription } from 'rxjs';
import { Validator } from 'src/app/models/classes/validator';
import { FormError } from 'src/app/models/classes/formError';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-admin-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.css']
})
export class ControlsComponent implements OnInit {
  public errors: FormError = null;

  public group: Group = null;
  
  public channel: string = "";

  public channels: Channel[] = [];

  public deactivatedChannels: Channel[] = [];

  public deactivateChannel: Channel = null;

  public deactivatedChannel: Channel = null;

  public username: string = "";

  public allGroupUsers: User[] = [];

  public selectedUser: User = null;

  public inviteChannel: Channel = null;

  public channelInviteUser: User = null;

  public removeFromChannel: Channel = null;

  public removeUserChannel: User = null;

  public removeUserGroup: User = null;

  public promoteUser: User = null

  public demoteUser: User = null;

  public role: string = "";

  private subscriptions: Subscription[] = [];

  constructor(private groupService: GroupService, private databaseService: DatabaseService,
    private messageService: MessageService, private auth: AuthenticationService) { }

  ngOnInit(): void {
    this.subscriptions.push(this.groupService.group$.subscribe(group => {
      this.group = group;
    }));

    this.subscriptions.push(this.groupService.channels$.subscribe(channels => {
      this.channels = channels.filter(channel => channel.name != "General Chat");
    }));

    this.subscriptions.push(this.groupService.deactivatedChannels$.subscribe(channels => {
      this.deactivatedChannels = channels;
    }));

    this.subscriptions.push(this.groupService.allGroupUsers$.subscribe(allUsers => {
      this.allGroupUsers = allUsers;
    }));
    this.role = this.isSuperAdmin() ? "Super Admin" : "Group Admin";
    //this.groupService.getDeactivatedChannels(this.group);
    this.groupService.getAllUsers();
    this.groupService.getDeactivatedChannels(this.group);
  }

  toggleGroupManagement(): void {
    this.groupService.toggleGroupManagement();
  }

  public addChannel(): void {
    this.errors = null;
    this.errors = new Validator({ channel: this.channel }).validate([
      { property: 'channel', rules: ['required'] }
    ]);

    if (!this.errors.hasErrors()) {
      this.groupService.addChannel(this.channel);
      this.channel = "";
    }
  }

  public removeChannel(): void {
    if (this.deactivateChannel) {
      this.groupService.removeChannel(this.deactivateChannel._id);
      this.deactivateChannel = null;
    } else {
      this.messageService.setMessage("Invalid Channel Selected For Removal", "error");
    }
  }

  public reactivateChannel(): void {
    if (this.deactivatedChannel) {
      this.groupService.reactivateChannel(this.deactivatedChannel._id);
      this.deactivatedChannel = null;
    } else {
      this.messageService.setMessage("Invalid Channel Selected For Activation", "error");
    }
  }

  public inviteUserToGroup(): void {
    this.errors = null;
    this.errors = new Validator({ username: this.username }).validate([
      { property: 'username', rules: ['required'] }
    ]);

    if (!this.errors.hasErrors()) {
      this.groupService.inviteUserToGroup(this.username);
      this.username = "";
    }
  }

  public isSuperAdmin(): boolean {
    return this.auth.user.role == "Super Admin";
  }

  public isGroupAdmin(): boolean {
    return this.auth.user.role == "Group Admin";
  }

  public removeUserFromGroup() {
    if (this.removeUserGroup) {
      this.groupService.removeUserFromGroup(this.group, this.removeUserGroup);
      this.removeUserGroup = null;
    } else {
      this.messageService.setMessage("Invalid User Selected For Group Removal", "error");
    }
  }

  public inviteUserToChannel() {
    if (this.channelInviteUser) {
      this.groupService.inviteUserToChannel(this.inviteChannel, this.channelInviteUser);
      console.log(this.channelInviteUser);
      this.channelInviteUser = null;
    } else {
      this.messageService.setMessage("Invalid User Selected For Channel Invite", "error");
    }
  }

  public removeUserFromChannel() {
    if (this.removeUserGroup) {
      this.groupService.removeUserFromChannel(this.removeFromChannel, this.removeUserChannel);
      this.removeUserChannel = null;
    } else {
      this.messageService.setMessage("Invalid User Selected For Channel Removal", "error");
    }
  }

  public promoteUserToGroupAssistant() {
    if (this.promoteUser) {
      this.groupService.promoteUserToGroupAssistant(this.group, this.promoteUser);
      this.promoteUser = null;
    } else {
      this.messageService.setMessage("Invalid User Selected For Promotion", "error");
    }
  }

  public demoteUserFromGroupAssistant() {
    if (this.demoteUser) {
      this.groupService.demoteUserFromGroupAssistant(this.group, this.demoteUser);
      this.demoteUser = null;
    } else {
      this.messageService.setMessage("Invalid User Selected For Demotion", "error");
    }
  }

  public getChannelUsers() {
    if (this.removeFromChannel) {      
      return this.allGroupUsers.filter(user => {
        return this.removeFromChannel.users.includes(user._id);
      });
    } 

    return [];
  }

  public inviteChannelUsers() {
    if (this.inviteChannel) {
      return this.allGroupUsers.filter(user => {
        return !this.inviteChannel.users.includes(user._id) && !this.group.assistants.includes(user._id);
      });
    }

    return [];
  }

  public removeChannelList() {
    let removeList =  this.channels.filter(channel => {
      return channel;
    });

    return removeList;
  }

  public removedChannels() {
    return this.channels.filter(channel => {
      return !channel.active;
    });
  }

  public promotableUsers() {
    return this.allGroupUsers.filter(user => {
      return !this.group.assistants.includes(user._id) || user._id != this.auth.user._id;
    });
  }

  public demotableUsers() {
    return this.allGroupUsers.filter(user => {
      return this.group.assistants.includes(user._id);
    });
  }

  public toString(object: object): string {
    return JSON.stringify(object);
  }

  public channelChanged(event: any) {
    console.log(event);
  } 
}
