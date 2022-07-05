import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-features',
  templateUrl: './product-features.component.html',
  styleUrls: ['./product-features.component.css']
})
export class ProductFeaturesComponent implements OnInit {

  constructor() {
    window.scrollTo(0, 0);
   }

  ngOnInit(): void {
  }

}
