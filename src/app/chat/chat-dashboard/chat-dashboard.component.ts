import { Component, OnInit } from '@angular/core';
import { RoomService } from '../../services/room.service';
import { GroupService } from 'src/app/services/group.service';
import { Subscription } from 'rxjs';
import { SocketService } from 'src/app/services/socket.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-chat-dashboard',
  templateUrl: './chat-dashboard.component.html',
  styleUrls: ['./chat-dashboard.component.css'],

  providers: [RoomService]
})
export class ChatDashboardComponent implements OnInit {

  isInGroup: boolean = false;

  isInChannel: boolean = false;

  addingGroup: boolean = false;

  toggledGroupManagement: boolean = false;

  editingAccountSettings: boolean = false;
  
  subscriptions: Subscription[] = [];

  constructor(private roomService: RoomService, private groupService: GroupService, private socketService: SocketService, private auth: AuthenticationService) { }

  ngOnInit(): void {
    this.subscriptions.push(this.groupService.group$.subscribe(group => {
      this.isInGroup = group != null;
    }));

    this.subscriptions.push(this.groupService.hasToggledGroupManagement$.subscribe(() => {
      this.toggledGroupManagement = !this.toggledGroupManagement;
      this.editingAccountSettings = false;
    }));

    this.subscriptions.push(this.roomService.toggleAccountSettings$.subscribe(() => {
      this.editingAccountSettings = !this.editingAccountSettings;
    }));

    this.subscriptions.push(this.groupService.addGroup$.subscribe(value => {
      this.addingGroup = value;
    }));

    this.subscriptions.push(this.groupService.channel$.subscribe(channel => {
      this.isInChannel = channel != null;
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

  public showGroupManagement(): boolean {
    return this.isInGroup && this.auth.isAdmin();
  }

  public showChatRoom(): boolean {
    return this.isInGroup && this.isInChannel && !this.toggledGroupManagement && !this.editingAccountSettings && !this.addingGroup;
  }

  public showAdminControls(): boolean {
    return this.isInGroup && this.toggledGroupManagement && !this.editingAccountSettings && !this.addingGroup;
  }

  public showGroupSearch(): boolean {
    return !this.isInGroup && !this.toggledGroupManagement && !this.editingAccountSettings && !this.addingGroup;
  }
  
  public showAddGroup(): boolean {
    return !this.isInGroup && !this.editingAccountSettings && this.addingGroup;
  }
}
