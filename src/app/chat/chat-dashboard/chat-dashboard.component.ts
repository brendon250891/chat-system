import { Component, OnInit } from '@angular/core';
import { RoomService } from '../../services/room.service';
import { GroupService } from 'src/app/services/group.service';

@Component({
  selector: 'app-chat-dashboard',
  templateUrl: './chat-dashboard.component.html',
  styleUrls: ['./chat-dashboard.component.css'],

  providers: [RoomService]
})
export class ChatDashboardComponent implements OnInit {

  isInGroup: boolean = false;

  toggledGroupManagement: boolean = false;

  editAccountSettings:boolean = false;

  constructor(private roomService: RoomService, private groupService: GroupService) { }

  ngOnInit(): void {
    this.groupService.hasJoinedGroup$.subscribe(value => {
      this.isInGroup = value;
    });

    this.groupService.hasToggledGroupManagement$.subscribe(() => {
      this.toggledGroupManagement = !this.toggledGroupManagement;
      this.editAccountSettings = false;
    });

    this.roomService.groupExit$.subscribe(() => {
      this.isInGroup = false;
    });

    this.roomService.toggleAccountSettings$.subscribe(() => {
      this.editAccountSettings = !this.editAccountSettings;
    })
  }

  toggleAccountSettings(): void {
    this.roomService.toggleAccountSettings();
  }

  toggleGroupManagement(): void {
    this.groupService.toggleGroupManagement();
  }
}
