import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    let storedData = { 
      users: [],
      groups: [],
      rooms: [],
      roles: [
        { id: 1, name: 'superAdministrator' },
        { id: 2, name: 'groupAdministrator' },
        { id: 3, name: 'groupAssistant'}
      ]
    }

    if (localStorage.getItem('chat') == null) {
      localStorage.setItem('chat', JSON.stringify(storedData));
    } 
  }

}
