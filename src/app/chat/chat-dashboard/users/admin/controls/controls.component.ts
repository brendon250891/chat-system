import { Component, OnInit } from '@angular/core';
import { RoomService } from 'src/app/services/room.service';
import { GroupService } from 'src/app/services/group.service';
import { Channel } from 'src/app/models/classes/channel';

@Component({
  selector: 'app-admin-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.css']
})
export class ControlsComponent implements OnInit {
  channels: Array<Channel> = null;
  channel: string = "";

  constructor(private groupService: GroupService) { }

  ngOnInit(): void {
    //this.channels = this.groupService.getChannels();
  }

  toggleGroupManagement(): void {
    this.groupService.toggleGroupManagement();
  }

  addChannel(): void {
    this.groupService.addChannel(this.channel);
  }
}
