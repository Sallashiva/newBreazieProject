import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import { CafetrriaServiceService } from '../cafetrria-service.service';

@Component({
  selector: 'app-catering-thanks',
  templateUrl: './catering-thanks.component.html',
  styleUrls: ['./catering-thanks.component.scss'],
})
export class CateringThanksComponent implements OnInit {
  path: string;
  visitorId: string;

  constructor(
    private router: Router,
    private navController: NavController,
    private platform: Platform,
    private cafeteriaService: CafetrriaServiceService
    ) {}

  ngOnInit() {
    this.goHome();
    this.path = `/cafeteria/cafeteria-item`;
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.navController.navigateBack(this.path);
    });
    this.getAllSettings()
  }

 async goHome() {
  //   localStorage.clear()
  // await  Storage.clear()
    setTimeout(() => {
      this.router.navigate(['/home']);
    }, 3000);
  }

  titleData:any
  messageData:any
  getAllSettings() {
    this.cafeteriaService.getSetting().subscribe(result => {
      console.log(result);

      this.titleData = result.settings[0].thankyouMessages?.title
      this.messageData = result.settings[0].thankyouMessages?.messages
    })
  }

}
