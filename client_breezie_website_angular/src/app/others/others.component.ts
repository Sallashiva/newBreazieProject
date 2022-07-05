import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-others',
  templateUrl: './others.component.html',
  styleUrls: ['./others.component.css']
})
export class OthersComponent implements OnInit {

  constructor() {
    window.scrollTo(0, 0);
   }

  ngOnInit(): void {
  }

}
