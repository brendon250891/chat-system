import { Component, OnInit, ComponentFactoryResolver } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DatabaseService } from 'src/app/services/database.service';
import { Group } from '../../../../models/interfaces/group';
import { GroupService } from 'src/app/services/group.service';

@Component({
  selector: 'app-group-search',
  templateUrl: './group-search.component.html',
  styleUrls: ['./group-search.component.css']
})
export class GroupSearchComponent implements OnInit {

  search:string = "";
  groupName: string = "";

  allGroups: Array<Group> = [];

  constructor(private auth: AuthenticationService, private database: DatabaseService, private groupService: GroupService) {}

  ngOnInit(): void {
    this.filterGroups();
  }

  searchChanged(): void {
    this.filterGroups();
    this.allGroups = this.allGroups.filter(group => 
      group.name.toLowerCase().indexOf(this.search.toLowerCase()) != -1
    );
  }

  addGroup(): void {
    this.database.addGroup(this.groupName);
  }

  requestInvitation(userId) {
    console.log(userId);
  }

  private filterGroups(): void {
    this.allGroups = this.database.getAllGroups().filter(group => {
      let notJoined = true;
      this.auth.user().groups.map(name => {
        notJoined = group.name != name
      });
      return notJoined;
    });
  }
}
 