import { Component, OnInit } from '@angular/core';
import { GroupService } from 'src/app/services/group.service';
import { Channel } from 'src/app/models/interfaces/channel';
import { SocketService } from 'src/app/services/socket.service';
import { DatabaseService } from 'src/app/services/database.service';
import { MessageService } from 'src/app/services/message.service';
import { User } from 'src/app/models/classes/user';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-admin-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.css']
})
export class ControlsComponent implements OnInit {
  channel: string = "";

  channels: Array<Channel> = [];

  deactivatedChannels: Channel[] = [];

  selectedChannel: Channel;

  selectedDeactivatedChannel: Channel;

  username: string = "";

  allGroupUsers: User[];

  selectedUser: User;

  inviteChannel: Channel;

  channelInviteUsername: string = "";

  removeFromChannel: Channel;

  removeUser: User;

  promoteUser: User;

  role: string = "";

  constructor(private groupService: GroupService, private socketService: SocketService, private databaseService: DatabaseService,
    private messageService: MessageService, private auth: AuthenticationService) { }

  ngOnInit(): void {
    this.socketService.channels$.subscribe(channels => {
      channels = channels.slice(1);
      this.channels = channels;
      this.selectedChannel = channels[0];
      this.inviteChannel = channels[0];
      this.removeFromChannel = channels[0];
    });
    this.socketService.deactivatedChannels$.subscribe(channels => {
      this.deactivatedChannels = channels;
      this.selectedDeactivatedChannel = channels[0];
    });
    this.socketService.allGroupUsers$.subscribe(allUsers => {
      this.allGroupUsers = allUsers;
      this.selectedUser = allUsers[0];
      this.promoteUser = allUsers[0];
      this.removeUser = this.setRemoveUser();
    });
    this.role = this.isSuperAdmin() ? "Super Admin" : "Group Admin";
  }

  toggleGroupManagement(): void {
    this.groupService.toggleGroupManagement();
  }

  public addChannel(): void {
    if (this.channel != "") {
      // this.socketService.addChannel(this.channel, []);
    }
  }

  public removeChannel(): void {
    // this.socketService.removeChannel(this.selectedChannel._id);
  }

  public reactivateChannel(): void {
    // this.socketService.reactivateChannel(this.selectedDeactivatedChannel._id);
  }

  public inviteUser(): void {
    this.databaseService.userExists(this.username).subscribe(userExists => {
      if (userExists.ok) {
        this.databaseService.isUserAlreadyInGroup(this.channels[0].groupId, this.username).subscribe(inGroup => {
          if (inGroup.ok) {
            this.messageService.setMessage(inGroup.message, "error");
          } else {
            this.databaseService.inviteUserToGroup(this.channels[0].groupId, this.username).subscribe(invite => {
              this.messageService.setMessage(invite.message, invite.ok ? "success" : "error");
            });
          }
        });
      } else {
        this.messageService.setMessage(userExists.message, "error");
      }
    });
  }

  public isSuperAdmin(): boolean {
    return this.auth.user.role == "Super Admin";
  }

  public isGroupAdmin(): boolean {
    return this.auth.user.role == "Group Admin";
  }

  public inviteUserToChannel() {
    this.databaseService.userExists(this.channelInviteUsername).subscribe(userExists => {
      if (!userExists.ok) {
        this.messageService.setMessage(userExists.message, "error");
      } else {
        this.databaseService.isUserAlreadyInGroup(this.channels[0].groupId, this.channelInviteUsername).subscribe(inGroup => {
          if (!inGroup.ok) {
            this.messageService.setMessage(inGroup.message, "error");
          } else {
            this.databaseService.isUserAlreadyInChannel(this.inviteChannel._id, this.channelInviteUsername).subscribe(inChannel => {
              if (inChannel.ok) {
                this.messageService.setMessage(inChannel.message, "error");
              } else {
                this.databaseService.inviteUserToChannel(this.inviteChannel._id, this.channelInviteUsername).subscribe(invited => {
                  this.messageService.setMessage(invited.message, invited.ok ? "success" : "error");
                });
              }
            });
          }
        });
      }
    });
  }

  private setRemoveUser() {
    return this.allGroupUsers.filter(user => {
      return this.removeFromChannel.users.includes(user._id);
    })[0];
  }

  public getChannelUsers() {
    return this.allGroupUsers.filter(user => {
      return this.removeFromChannel.users.includes(user._id);
    });
  }

  public removeUserFromChannel() {
    // this.socketService.removeUserFromChannel(this.removeFromChannel._id, this.removeUser);
    this.setRemoveUser();
  }
}
