import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { CameraTabDefaultPagePage } from '../pages/camera-tab-default-page/camera-tab-default-page';
import { HomePage } from '../pages/home/home';
import { TabsControllerPage } from '../pages/tabs-controller/tabs-controller';
import { LoginPage } from '../pages/login/login';



@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) navCtrl: NavController;
    rootPage:any = LoginPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
  
}
