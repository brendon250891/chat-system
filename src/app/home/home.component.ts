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
      groups: [
        { id: 1, avatar: 'nrl.png', name: 'NRL', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean vestibulum non diam non laoreet. Sed iaculis quam eget semper mattis. Aliquam erat volutpat.' },
        { id: 2, avatar: 'nk.png', name: 'Newcastle Knights Fans', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean vestibulum non diam non laoreet. Sed iaculis quam eget semper mattis. Aliquam erat volutpat.' },
        { id: 3, avatar: 'epl.png', name: 'EPL', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean vestibulum non diam non laoreet. Sed iaculis quam eget semper mattis. Aliquam erat volutpat.' },
        { id: 3, avatar: 'epl.png', name: 'EPL', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean vestibulum non diam non laoreet. Sed iaculis quam eget semper mattis. Aliquam erat volutpat.' },
        { id: 3, avatar: 'epl.png', name: 'EPL', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean vestibulum non diam non laoreet. Sed iaculis quam eget semper mattis. Aliquam erat volutpat.' },
        { id: 2, avatar: 'nk.png', name: 'Newcastle Knights Fans', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean vestibulum non diam non laoreet. Sed iaculis quam eget semper mattis. Aliquam erat volutpat.' },
        { id: 2, avatar: 'nk.png', name: 'Newcastle Knights Fans', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean vestibulum non diam non laoreet. Sed iaculis quam eget semper mattis. Aliquam erat volutpat.' },
        { id: 2, avatar: 'nk.png', name: 'Newcastle Knights Fans', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean vestibulum non diam non laoreet. Sed iaculis quam eget semper mattis. Aliquam erat volutpat.' },
        { id: 2, avatar: 'nk.png', name: 'Newcastle Knights Fans', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean vestibulum non diam non laoreet. Sed iaculis quam eget semper mattis. Aliquam erat volutpat.' },
        { id: 2, avatar: 'nk.png', name: 'Newcastle Knights Fans', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean vestibulum non diam non laoreet. Sed iaculis quam eget semper mattis. Aliquam erat volutpat.' },
        { id: 2, avatar: 'nk.png', name: 'Newcastle Knights Fans', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean vestibulum non diam non laoreet. Sed iaculis quam eget semper mattis. Aliquam erat volutpat.' },
        { id: 3, avatar: 'epl.png', name: 'EPL', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean vestibulum non diam non laoreet. Sed iaculis quam eget semper mattis. Aliquam erat volutpat.' },
      ],
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
