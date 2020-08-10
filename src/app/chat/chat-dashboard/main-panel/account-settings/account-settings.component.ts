import { Component, OnInit } from '@angular/core';
import { RoomService } from 'src/app/services/room.service';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.css']
})
export class AccountSettingsComponent implements OnInit {

  constructor(private roomService: RoomService) { }

  ngOnInit(): void {
  }

  toggleAccountSettings() {
    this.roomService.toggleAccountSettings();
  }
}
