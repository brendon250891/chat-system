import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private message = new Subject<string>();
  private type = new Subject<string>();
  private transition = new Subject<string>();

  message$ = this.message.asObservable();
  type$ = this.type.asObservable();
  transition$ = this.transition.asObservable();

  constructor() { }

  setMessage(message: string, type: string) {
    this.message.next(message);
    this.type.next(type);
  }

  clearMessage() {
    this.message.next("");
    this.type.next("");
  }

  setTransition(transition) {
    this.transition.next(transition);
  }
}

export enum ErrorType {
  INFO,
  ERROR,
  SUCCESS
}
