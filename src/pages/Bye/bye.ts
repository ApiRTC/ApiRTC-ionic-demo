import { Component } from '@angular/core';
import { NavController, Platform, AlertController } from 'ionic-angular';

@Component({
  selector: 'page-bye',
  templateUrl: 'bye.html'
})
export class ByePage {  
  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public platform: Platform) {
  }
}
