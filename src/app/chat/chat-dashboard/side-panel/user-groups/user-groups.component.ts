import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from 'src/app/services/authentication.service';
import { User } from '../../../../models/classes/user';
import { Group } from '../../../../models/interfaces/group';
import { DatabaseService } from 'src/app/services/database.service';
import { GroupService } from 'src/app/services/group.service';

@Component({
  selector: 'app-user-groups',
  templateUrl: './user-groups.component.html',
  styleUrls: ['./user-groups.component.css']
})
export class UserGroupsComponent implements OnInit {
  user: User;

  constructor(private groupService: GroupService, private auth: AuthenticationService, private database: DatabaseService) { }

  ngOnInit(): void {
    this.user = this.auth.user();
  }

  userHasGroups(): boolean {
    return this.user.groups.length > 0;
  }

  getUserGroups(): Array<Group> {
    return this.database.getUserGroups(this.user.username);
  }

  enterGroup(group: Group): void {
    this.groupService.joinGroup(group);
  }
}