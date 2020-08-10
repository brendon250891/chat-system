import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class RoomService {

  private groupEntered = new Subject<Group>();
  private toggleGroupManagement = new Subject();
  private groupExit = new Subject();
  private groupAddChanel = new Subject<string>();
  private toggleAccount = new Subject<boolean>();

  groupEntered$ = this.groupEntered.asObservable();
  toggleGroupManagement$ = this.toggleGroupManagement.asObservable();
  groupExit$ = this.groupExit.asObservable();
  groupAddChannel$ = this.groupAddChanel.asObservable();
  toggleAccountSettings$ = this.toggleAccount.asObservable();

  constructor() { }

  enteredGroupChat(group: Group) {
    this.groupEntered.next(group);
  }

  toggleManageGroup() {
    this.toggleGroupManagement.next();
  }

  exitGroup() {
    this.groupExit.next();
  }

  addChannel(name: string) {
    this.groupAddChanel.next(name)
  }

  toggleAccountSettings() {
    this.toggleAccount.next();
  }
}

interface Group {
  id: number;
  avatar: string;
  name: string;
  description: string;
}
