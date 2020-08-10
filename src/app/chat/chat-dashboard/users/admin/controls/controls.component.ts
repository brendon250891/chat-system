import { Component, OnInit } from '@angular/core';
import { RoomService } from 'src/app/services/room.service';

@Component({
  selector: 'app-admin-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.css']
})
export class ControlsComponent implements OnInit {

  channel: string = "";

  constructor(private roomService: RoomService) { }

  ngOnInit(): void {
  }

  toggleGroupManagement(): void {
    this.roomService.toggleManageGroup();
  }

  addChannel(): void {
    this.roomService.addChannel(this.channel);
  }
}
