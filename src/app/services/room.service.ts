import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { Group } from '../models/interfaces/group';
import { DatabaseService } from './database.service';

@Injectable()
export class RoomService {
  private groupExit = new Subject();
  private groupAddChanel = new Subject<string>();
  private toggleAccount = new Subject<boolean>();

  groupExit$ = this.groupExit.asObservable();
  groupAddChannel$ = this.groupAddChanel.asObservable();
  toggleAccountSettings$ = this.toggleAccount.asObservable();

  public isAddingUser$ = new BehaviorSubject<boolean>(false);

  constructor(private database: DatabaseService) { }

  addChannel(name: string) {
    this.groupAddChanel.next(name)
  }

  toggleAccountSettings() {
    this.toggleAccount.next();
  }

  public toggleAddUser(show: boolean): void {
    this.isAddingUser$.next(show);
  }

  findGroup(name: string): Group {
    return null;
    //return this.database.getGroup(name);
  }
}