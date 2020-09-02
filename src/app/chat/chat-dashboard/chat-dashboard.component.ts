import { Component, OnInit } from '@angular/core';
import { RoomService } from '../../services/room.service';
import { GroupService } from 'src/app/services/group.service';
import { Subscription } from 'rxjs';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-chat-dashboard',
  templateUrl: './chat-dashboard.component.html',
  styleUrls: ['./chat-dashboard.component.css'],

  providers: [RoomService]
})
export class ChatDashboardComponent implements OnInit {

  isInGroup: boolean = false;

  toggledGroupManagement: boolean = false;

  editAccountSettings: boolean = false;
  
  subscriptions: Subscription[] = [];

  constructor(private roomService: RoomService, private groupService: GroupService, private socketService: SocketService) { }

  ngOnInit(): void {
    this.subscriptions.push(this.socketService.group$.subscribe(group => {
      this.isInGroup = group != null;
    }));

    this.subscriptions.push(this.groupService.hasToggledGroupManagement$.subscribe(() => {
      this.toggledGroupManagement = !this.toggledGroupManagement;
      this.editAccountSettings = false;
    }));

    this.subscriptions.push(this.roomService.groupExit$.subscribe(() => {
      this.isInGroup = false;
    }));

    this.subscriptions.push(this.roomService.toggleAccountSettings$.subscribe(() => {
      this.editAccountSettings = !this.editAccountSettings;
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.map(subscription => {
      subscription.unsubscribe();
    });
  }

  toggleAccountSettings(): void {
    this.roomService.toggleAccountSettings();
  }

  toggleGroupManagement(): void {
    this.groupService.toggleGroupManagement();
  }
}
