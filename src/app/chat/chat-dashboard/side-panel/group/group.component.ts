import { Component, OnInit } from '@angular/core';
import { GroupService } from 'src/app/services/group.service';
import { Group } from 'src/app/models/interfaces/group';
import { Channel } from 'src/app/models/classes/channel';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { User } from 'src/app/models/classes/user';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {
  group: Group = null;

  channels: Array<Channel> = null;

  showOptionsFor: number = null;

  displayOptions: boolean = false;

  constructor(private groupService: GroupService, private auth: AuthenticationService) { }

  ngOnInit(): void {
    this.group = this.groupService.getGroup();
    this.channels = this.groupService.getChannels();
    console.log(this.channels[0]);
    this.groupService.joinChannel(this.channels[0]);
  }

  leaveGroupChat(): void {
    this.groupService.leaveGroup();
  }

  toggleOptions(value: number) {
    this.displayOptions = !this.displayOptions;
    this.showOptionsFor = this.displayOptions ? value : null;
  }

  hasPrivileges(name: string): boolean {
    if (this.auth.user().role == "Super Admin" || this.auth.user().role == "Group Admin") {
      return true;
    }

    let hasPrivileges = false;
    this.group.administrators.map(admin => {
      if (admin == this.auth.user().username) {
        hasPrivileges = true;
      }
    });

    return hasPrivileges;
  }
}
