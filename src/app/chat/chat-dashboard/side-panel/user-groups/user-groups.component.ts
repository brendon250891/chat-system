import { Component, OnInit } from '@angular/core';
import { RoomService } from 'src/app/services/room.service';

@Component({
  selector: 'app-user-groups',
  templateUrl: './user-groups.component.html',
  styleUrls: ['./user-groups.component.css']
})
export class UserGroupsComponent implements OnInit {

  groups: Array<Group> = [];

  constructor(private roomService: RoomService) { }

  ngOnInit(): void {
    let appData: AppData = JSON.parse(localStorage.getItem('chat'));
    this.groups = appData.groups;
  }

  userHasGroups(): boolean {
    return this.groups.length > 0;
  }

  enterGroup(group: Group): void {
    this.roomService.enteredGroupChat(group);
  }
}


interface Group {
  id:number;
  avatar:string;
  name:string;
  description:string;
}

interface AppData {
  groups:Array<Group>;
}