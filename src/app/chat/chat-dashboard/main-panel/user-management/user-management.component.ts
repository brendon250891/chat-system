import { Component, OnInit } from '@angular/core';
import { RoomService } from 'src/app/services/room.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  public tab: string = "addUser";

  constructor(private roomService: RoomService) { }

  ngOnInit(): void {
  }

  public openTab(tab: string): void {
    this.tab = tab;
  }

  public closeUserManagement(): void {
    this.roomService.isAddingUser$.next(false);
  }
}
