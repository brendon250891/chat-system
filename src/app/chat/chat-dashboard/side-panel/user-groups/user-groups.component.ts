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
  userGroups: Array<any> = [];
  subscriptions: Array<Subscription> = [];

  constructor(private auth: AuthenticationService, private database: DatabaseService,
  private socketService: SocketService) { }

  ngOnInit(): void {
    this.user = this.auth.user;
    if (this.auth.isAdmin()) {
      this.subscriptions.push(this.database.getAllGroups().subscribe(groups => {
        this.userGroups = groups;
      }));
    } else {
      this.subscriptions.push(this.database.getUserGroups(this.user.username).subscribe(groups => {
        this.userGroups = groups;
      }));
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
    //this.groupService.leaveChannel();
  }

  userHasGroups(): boolean {
    return this.userGroups.length > 0;
  }

  getUserGroups(): Array<Group> {
    return this.userGroups;
  }

  connectToGroup(group: Group): void {
    this.socketService.connectToGroup(group);
  }
}