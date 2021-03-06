import { Component, OnInit } from '@angular/core';
import { RoomService } from '../../services/room.service';
import { GroupService } from 'src/app/services/group.service';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ThrowStmt } from '@angular/compiler';
import { Group } from 'src/app/models/interfaces/group';

@Component({
  selector: 'app-chat-dashboard',
  templateUrl: './chat-dashboard.component.html',
  styleUrls: ['./chat-dashboard.component.css'],

  providers: [RoomService]
})
export class ChatDashboardComponent implements OnInit {
  group: Group = null;
  
  isInGroup: boolean = false;

  isInChannel: boolean = false;

  addingGroup: boolean = false;

  isAddingUser: boolean = false;

  toggledGroupManagement: boolean = false;

  editingAccountSettings: boolean = false;
  
  subscriptions: Subscription[] = [];

  constructor(private roomService: RoomService, private groupService: GroupService, private auth: AuthenticationService) { }

  ngOnInit(): void {
    this.subscriptions.push(this.groupService.group$.subscribe(group => {
      this.group = group;
      this.isInGroup = group != null;
    }));

    this.subscriptions.push(this.groupService.toggleGroupManagement$.subscribe(value => {
      this.toggledGroupManagement = value
      this.editingAccountSettings = false;
    }));

    this.subscriptions.push(this.roomService.toggleAccountSettings$.subscribe(() => {
      this.editingAccountSettings = !this.editingAccountSettings;
      this.toggledGroupManagement = false;
    }));

    this.subscriptions.push(this.groupService.addGroup$.subscribe(value => {
      this.addingGroup = value;
    }));

    this.subscriptions.push(this.groupService.channel$.subscribe(channel => {
      this.isInChannel = channel != null;
    }));

    this.subscriptions.push(this.roomService.isAddingUser$.subscribe(isAddingUser => {
      this.isAddingUser = isAddingUser;
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.map(subscription => {
      subscription.unsubscribe();
    });
  }

  toggleAddUser(): void {
    this.isAddingUser = true;
  }

  toggleAccountSettings(): void {
    this.roomService.toggleAccountSettings();
  }

  toggleGroupManagement(): void {
    this.groupService.toggleGroupManagement();
  }

  public showAddUser(): boolean {
    return !this.isInGroup && !this.editingAccountSettings && this.isAddingUser;
  }

  public showGroupManagement(): boolean {
    return this.isInGroup && this.isAdmin();
  }

  public showChatRoom(): boolean {
    return this.isInGroup && this.isInChannel && !this.toggledGroupManagement && !this.editingAccountSettings && !this.addingGroup;
  }

  public showAdminControls(): boolean {
    return this.isInGroup && this.toggledGroupManagement && !this.editingAccountSettings && !this.addingGroup;
  }

  public showGroupSearch(): boolean {
    return !this.isInGroup && !this.toggledGroupManagement && !this.editingAccountSettings && !this.addingGroup && !this.isAddingUser;
  }
  
  public showAddGroup(): boolean {
    return !this.isInGroup && !this.editingAccountSettings && this.addingGroup;
  }

  private isAdmin(): boolean {
    return this.auth.isAdmin() || this.group.assistants.includes(this.auth.user._id);
  }
}
