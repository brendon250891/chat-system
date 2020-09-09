import { Component, OnInit } from '@angular/core';

import { DatabaseService } from 'src/app/services/database.service';
import { MessageService } from 'src/app/services/message.service';
import { Validator } from 'src/app/models/classes/validator';
import { FormError } from 'src/app/models/classes/formError';
import { GroupService } from 'src/app/services/group.service';

@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.component.html',
  styleUrls: ['./add-group.component.css']
})
export class AddGroupComponent implements OnInit {
  errors: FormError = null;

  groupForm: GroupForm = {
    name: "",
    description: "",
    avatar: "placeholder.jpg",
    users: [],
    assistants: [],
    active: true,
  }

  channels: string[] = ["General Chat"];

  users: string[] = [];

  channel: string = "";

  username: string = "";

  constructor(private groupService: GroupService, private databaseService: DatabaseService,
    private messageService: MessageService) { }

  ngOnInit(): void {
  }

  public toggleAddGroup(): void {
    this.groupService.toggleAddGroup();
  }

  public addChannel(): void {
    if (this.channel != "") {
      this.channels.push(this.channel);
      this.channel = "";
    }
  }

  public addUser(): void {
    if (this.username != "") {
      this.databaseService.getUser(null, this.username).subscribe(response => {
        if (response.ok) {
          this.groupForm.users.push(response.user._id);
          this.users.push(response.user.username)
        } else {
          this.messageService.setMessage(`'${this.username}' Does Not Exist`, "error");
        }
        this.username = "";
      });
    }
  }

  public addGroup(): void {
    this.errors = new Validator(this.groupForm).validate([
      { property: 'name', rules: ['required']},
      { property: 'description', rules: ['required']},
    ]);
    if (!this.errors.hasErrors()) {
      this.groupService.addGroup(this.groupForm, this.channels);
      this.resetForm();
    }
  }

  public cancel(): void {
    this.resetForm();
    this.groupService.toggleAddGroup();
  } 

  private resetForm(): void {
    Object.keys(this.groupForm).map(key => {
      switch (typeof (key)) {
        case "string":
          this.groupForm[key] = "";
        case "object":
          this.groupForm[key] = [];
      }
    });

    this.channels = ["General Chat"];
    this.users = [];
  }
}

export interface GroupForm {
  name: string;
  description: string;
  avatar: string;
  users: number[];
  assistants: string[];
  active: boolean
}