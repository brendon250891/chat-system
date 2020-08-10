import { Component, OnInit } from '@angular/core';
import { RoomService } from 'src/app/services/room.service';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {

  channels: Array<string> = ['Lobby'];

  showOptionsFor: number = null;

  displayOptions: boolean = false;

  constructor(private roomService: RoomService) { }

  ngOnInit(): void {
    this.roomService.groupAddChannel$.subscribe(name => {
      this.channels.push(name);
    });
  }

  leaveGroupChat(): void {
    this.roomService.exitGroup();
  }

  toggleOptions(value: number) {
    this.displayOptions = !this.displayOptions;
    this.showOptionsFor = this.displayOptions ? value : null;
  }
}
