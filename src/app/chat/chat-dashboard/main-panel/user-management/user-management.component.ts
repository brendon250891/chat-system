import { Component, OnInit } from '@angular/core';
import { RoomService } from 'src/app/services/room.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  public tab: string = "addUser";

  constructor(private roomService: RoomService, private auth: AuthenticationService) { }

  ngOnInit(): void {
  }

  public openTab(tab: string): void {
    this.tab = tab;
  }

  public closeUserManagement(): void {
    this.roomService.isAddingUser$.next(false);
  }

  public isSuperAdmin(): boolean {
    return this.auth.user.role == "Super Admin";
  }
}
