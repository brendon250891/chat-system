import { Component, OnInit, ComponentFactoryResolver } from '@angular/core';

@Component({
  selector: 'app-group-search',
  templateUrl: './group-search.component.html',
  styleUrls: ['./group-search.component.css']
})
export class GroupSearchComponent implements OnInit {

  search:string = "";
  allGroups:Array<Group> = [];

  constructor() { }

  ngOnInit(): void {
    this.allGroups = this.getAllGroups();
  }
  
  searchChanged(): void {
    this.allGroups = this.getAllGroups();
    this.allGroups = this.allGroups.filter(group => group.name.toLowerCase().indexOf(this.search.toLowerCase()) != -1);
  }

  getAllGroups(): Array<Group> {
    let appData:AppData = JSON.parse(localStorage.getItem('chat'));
    return appData.groups;
  }

  requestInvitation(userId) {
    console.log(userId);
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
 