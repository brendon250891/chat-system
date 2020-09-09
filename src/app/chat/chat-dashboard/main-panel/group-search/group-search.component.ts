import { Component, OnInit, ComponentFactoryResolver } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DatabaseService } from 'src/app/services/database.service';
import { Group } from '../../../../models/interfaces/group';
import { GroupService } from 'src/app/services/group.service';

import { ThrowStmt } from '@angular/compiler';
import { RoomService } from 'src/app/services/room.service';
import { MessageService } from 'src/app/services/message.service';

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

  constructor(private auth: AuthenticationService, private messageService: MessageService, private groupService: GroupService,
  private roomService: RoomService) { }

  ngOnInit(): void {
    this.groupService.groups$.subscribe(groups => {
      this.allGroups = this.auth.isAdmin() ? groups : groups?.filter(group => group.active && !group.users.includes(this.auth.user._id));
    });
  }

  searchChanged(): void {
    this.filterGroups();
    this.filteredGroups = this.allGroups.filter(group => 
      group.name.toLowerCase().indexOf(this.search.toLowerCase()) != -1
    );
  }

  addGroup(): void {
    this.groupService.toggleAddGroup();
  }

  // Opens the add user screen.
  public addUser(): void {
    this.roomService.toggleAddUser(true);
  }

  requestInviteToGroup(): void {
    this.messageService.setMessage("This Feature Is Currently Unavailable", "info");
  }

  public removeGroup(group: Group): void {
    this.groupService.removeGroup(group);
  }

  public reactivateGroup(group: Group): void {
    this.groupService.reactivateGroup(group);
  }

  public refreshGroups(): void {
    this.groupService.getAllGroups();
  }

  isAdmin(): boolean {
    return this.auth.isAdmin();
  }

  private filterGroups(): void {
    this.filteredGroups =  this.allGroups;
    this.filteredGroups.filter(group => {
      return group.users.includes(this.auth.user._id);
    });
  }
}
 