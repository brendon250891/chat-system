import { Component, OnInit } from '@angular/core';
import { MessageService } from 'src/app/services/message.service';
import { Subscription } from 'rxjs';
import { trigger, state, animate, transition, style} from '@angular/animations';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css'],
  animations: [
    trigger('showHide', [
      state('show', style({
        opacity: 1,
      })),

      state('hide', style({
        opacity: 0,
      })),

      transition('hide => show', [
        animate('.25s')
      ]),
    ])
  ]
})
export class MessageComponent implements OnInit {

  message: string = "";
  type: string = "";
  background: string = "";
  subscriptions: Array<Subscription> = [];
  show: boolean = true;

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.subscriptions.push(this.messageService.message$.subscribe(m => {
      this.message = m;
      this.show = true;
    }));

    this.subscriptions.push(this.messageService.type$.subscribe(t => {
      this.type = t;
      this.background = this.setBackground();
      setTimeout(() => {
        this.show = false;
      }, 3000);
    }));
  }
  
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  setBackground(): string {
    return this.type == "error" ? 'bg-red-500' : this.type == "info" ? 'bg-blue-500' : 'bg-green-500';
  }

  hasMessage(): boolean {
    return this.message != "";
  }
  
  getType(): string {
    return `${this.type.substring(0, 1).toUpperCase()}${this.type.substring(1)}`;
  }

  hideMessage(): void {
    this.show = false;
  }
}
