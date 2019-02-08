import { Component,ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ByePage } from '../pages/bye/bye';
import { ApirtcProvider } from '../providers/apirtc/apirtc';
declare var AudioToggle;
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) rootNav: Nav;

  rootPage:any = HomePage;
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,apirtcProvider:ApirtcProvider) {
    this.hangupHandler =this.hangupHandler.bind(this);
    this.incomingCallHandler =this.incomingCallHandler.bind(this);
    apirtcProvider.events.subscribe('incomingCallHandler',this.incomingCallHandler);
    apirtcProvider.events.subscribe('hangupHandler',this.hangupHandler);
    platform.ready().then(() => {
      console.info("AUDIO TOGGLE",AudioToggle);
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      console.log('[MyApp] platform ready',apirtcProvider.events);
      apirtcProvider.apiRTCInit();
      
    });
  }
  incomingCallHandler(){
    if(this.rootNav.getActive().name!=="HomePage"){
      this.rootNav.push(HomePage);
    }
  }
  hangupHandler(){
    this.rootNav.push(ByePage);
  }
}

