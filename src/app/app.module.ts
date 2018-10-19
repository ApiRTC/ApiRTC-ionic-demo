import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, Events } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ByePage } from '../pages/bye/bye';
import { ApirtcProvider } from '../providers/apirtc/apirtc';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ByePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ByePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Events,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ApirtcProvider
    ]
})
export class AppModule {}
