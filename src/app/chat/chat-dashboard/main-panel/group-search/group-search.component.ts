import { Component, OnInit, ComponentFactoryResolver } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DatabaseService } from 'src/app/services/database.service';
import { Group } from '../../../../models/interfaces/group';
import { GroupService } from 'src/app/services/group.service';
import { SocketService } from 'src/app/services/socket.service';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-group-search',
  templateUrl: './group-search.component.html',
  styleUrls: ['./group-search.component.css']
})
export class GroupSearchComponent implements OnInit {
  public search: string = "";
  
  public groupName: string = "";

  public allGroups: Array<Group> = [];
  
  public filteredGroups: Array<Group> = [];

  constructor(private auth: AuthenticationService, private database: DatabaseService, private groupService: GroupService,
  private socketService: SocketService) { }

  ngOnInit(): void {
    this.groupService.groups$.subscribe(groups => {
      this.allGroups = groups;
    });
  }

  searchChanged(): void {
    this.filterGroups();
    this.filteredGroups = this.allGroups.filter(group => 
      group.name.toLowerCase().indexOf(this.search.toLowerCase()) != -1
    );
  }

  addGroup(): void {
    this.socketService.toggleAddGroup();
  }

  requestInvitation(userId) {
    console.log(userId);
  }

  public removeGroup(group: Group) {
    this.groupService.removeGroup(group);
  }

  isSuperAdmin(): boolean {
    return this.auth.user.role == "Super Admin";
  }

  private filterGroups(): void {
    this.filteredGroups =  this.allGroups;
    this.filteredGroups.filter(group => {
      return group.users.find(userId => {
        return userId == this.auth.user._id;
      });
    });
  }
}
 