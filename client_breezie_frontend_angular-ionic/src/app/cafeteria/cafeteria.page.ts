import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ModalPage } from '../modal/modal.page';
import { RegisterService } from '../register/register.service';
import { CafetrriaServiceService } from './cafetrria-service.service';
@Component({
  selector: 'app-cafeteria',
  templateUrl: './cafeteria.page.html',
  styleUrls: ['./cafeteria.page.scss'],
})

export class CafeteriaPage implements OnInit {
  visitorId: string;
  employeeId: string
  path: string;
  subscription: Subscription;

  constructor(
    private navController: NavController,
    private modalCtrl: ModalController,
    private platform: Platform,
    private RegisterService: RegisterService,
    private cafeteriaService:CafetrriaServiceService
  ) {}

  ngOnInit() {
    this.path = `/camera/camera`;

    this.platform.backButton.subscribeWithPriority(10, () => {
      this.navController.navigateBack(this.path);
    });
    this.RegisterService.changeVisitorId()
    this.getDeviceData()
    this.getFoodsData()
    this.getBeverage()
  }
  foods:any
  getFoodsData() {
    this.cafeteriaService.getFoods().subscribe(res=>{
      this.foods = res.catering;
    })
  }
  checkCatering:any
  getDeviceData() {
    this.RegisterService.getDeviceDatabyId().subscribe(result => {
      
      this.checkCatering = result.deviceData.catering

    })
  }
  beverages:any
  getBeverage() {
    this.cafeteriaService.getBeverages().subscribe(res=>{
      this.beverages = res.catering;
      console.log(this.beverages.length);     
    })
  }

  skip() {
    this.navController.navigateRoot(['cafeteria/thankyou']);
  }

  refreshment() {
    this.subscription = this.RegisterService.currentVisitorId.subscribe(email => {
      this.visitorId = email;
    });
    if(this.checkCatering === true && this.beverages.length>0 ){
      this.navController.navigateRoot(['cafeteria/cafeteria-item']);
    }
    else if(this.checkCatering === true && this.foods.length>0)
    {
      this.navController.navigateRoot(['cafeteria/foods'])
    }
      else {
      this.navController.navigateRoot(['cafeteria/thankyou']);
    }
  }

  qrCodeOpen() {
    this.modalCtrl
      .create({
        component: ModalPage,
        backdropDismiss: false,
      })
      .then((modalres) => {
        modalres.present();
      });
  }
}
