import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from 'src/app/services/authentication.service';
import { User } from '../../../../models/classes/user';
import { Group } from 'src/app/models/interfaces/group';
import { DatabaseService } from 'src/app/services/database.service';
import { GroupService } from 'src/app/services/group.service';
import { Subscription } from 'rxjs';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-user-groups',
  templateUrl: './user-groups.component.html',
  styleUrls: ['./user-groups.component.css']
})
export class UserGroupsComponent implements OnInit {
  user: User;
  groups: Array<any> = [];
  subscriptions: Array<Subscription> = [];

  constructor(private auth: AuthenticationService, private databaseService: DatabaseService,
  private socketService: SocketService, private groupService: GroupService) { }

  ngOnInit(): void {
    this.subscriptions.push(this.groupService.groups$.subscribe(groups => {
      this.groups = groups;
    }));

    this.groupService.getAllGroups();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  } 

  // Connects to a group, using a service to inform subscribers
  public connectToGroup(group: Group) {
    this.groupService.connectToGroup(group);
  }

  public getUserGroups(): Array<Group> {
    if (this.auth.isAdmin()) {
      return this.groups;
    } else {
      return this.groups.filter(group => {
        return group.users.includes(this.auth.user._id);
      });
    }
  }

  getUsername(): string {
    return this.auth.user.username;
  }
}