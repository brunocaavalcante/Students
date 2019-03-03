import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TestePage } from '../teste/teste';

@Component({
  selector: 'page-camera-tab-default-page',
  templateUrl: 'camera-tab-default-page.html'
})
export class CameraTabDefaultPagePage {

  constructor(public navCtrl: NavController) {
  }
  Test(){
    this.navCtrl.push(TestePage);
  }
  
}
