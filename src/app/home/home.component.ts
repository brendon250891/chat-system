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
      users: [
        { id: 1, username: 'Super', email: 'admin@chat-system.com', password: '123', role: 1 },
        { id: 2, username: 'Brendon', email: 'brendon@chat-system.com', password: '123', role: null },
        { id: 3, username: 'Jane', email: 'jane@chat-system.com', password: '123', role: null },
        { id: 4, username: 'John', email: 'john@chat-system.com', password: '123', role: null },
        { id: 5, username: 'Wayne', email: 'wayne@chat-system.com', password: '123', role: 2 },
        { id: 6, username: 'Justin', email: 'justin@chat-system.com', password: '123', role: 2 },
        { id: 7, username: 'jose', email: 'jose@chat-system.com', password: '123', role: 2 },
      ],
      groups: [
        { id: 1, avatar: 'nrl.png', name: 'NRL', 
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean vestibulum non diam non laoreet. \
            Sed iaculis quam eget semper mattis. Aliquam erat volutpat.', 
          administrators: [
            { user_id: 5}, 
          ], 
          channels: [
            { id: 1, name: 'General Chat', 
              users: [
                { user_id: 2 }
              ]}
          ]},
        { id: 2, avatar: 'nk.png', name: 'Newcastle Knights Fans', 
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean vestibulum non diam non laoreet. \
            Sed iaculis quam eget semper mattis. Aliquam erat volutpat.',
          administrators: [
            { user_id: 6 }
          ],
          channels: [
            { id: 2, name: 'Upcoming Games',
              users: [
                { user_id: 3 }
              ]}
          ]
        },
        { id: 3, avatar: 'epl.png', name: 'EPL', 
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean vestibulum non diam non laoreet. \
            Sed iaculis quam eget semper mattis. Aliquam erat volutpat.',
          administrators: [
            { user_id: 7 }
          ],
          channels: [
            { id: 3, name: 'Arsenal Fans'}
          ]
        },
      ],
      roles: [
        { id: 1, name: 'Super Admin' },
        { id: 2, name: 'Group Admin' },
        { id: 3, name: 'Group Assist'}
      ]
    }

    if (localStorage.getItem('chat') == null) {
      localStorage.setItem('chat', JSON.stringify(storedData));
    } 
  }

}
