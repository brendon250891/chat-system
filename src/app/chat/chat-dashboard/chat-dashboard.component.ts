import { Component, OnInit } from '@angular/core';
import { RoomService } from '../../services/room.service';

@Component({
  selector: 'app-chat-dashboard',
  templateUrl: './chat-dashboard.component.html',
  styleUrls: ['./chat-dashboard.component.css'],

  providers: [RoomService]
})
export class ChatDashboardComponent implements OnInit {

  group = null;

  groupControls:boolean = false;

  editAccountSettings:boolean = false;

  constructor(private roomService: RoomService) { }

  ngOnInit(): void {
    this.roomService.groupEntered$.subscribe(group => {
      this.group = group;
    });

    this.roomService.toggleGroupManagement$.subscribe( () => {
      this.groupControls = !this.groupControls;
    });

    this.roomService.groupExit$.subscribe(() => {
      this.group = null;
    });

    this.roomService.toggleAccountSettings$.subscribe(() => {
      this.editAccountSettings = !this.editAccountSettings;
    })
  }

  toggleAccountSettings(): void {
    this.roomService.toggleAccountSettings();
  }

  toggleGroupManagement(): void {
    this.roomService.toggleManageGroup();
    this.editAccountSettings = false;
  }
}
