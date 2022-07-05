import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.css']
})
export class PricingComponent implements OnInit {
  visitormanagementtable:boolean=false
  constructor() {
    window.scrollTo(0, 0);
   }

  ngOnInit(): void {
  }
  visitorManagement(){
      this.visitormanagementtable=true;
  }
  hidetable(){
    this.visitormanagementtable=false;
  }
}
