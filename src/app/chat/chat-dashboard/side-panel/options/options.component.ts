import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css']
})
export class OptionsComponent implements OnInit {
  showPromotionOptions: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  toggleOptions() {
    console.log("Hovered");
    this.showPromotionOptions = !this.showPromotionOptions;
  }

}
