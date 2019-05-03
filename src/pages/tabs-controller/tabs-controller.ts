import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CameraTabDefaultPagePage } from '../camera-tab-default-page/camera-tab-default-page';
import { CartTabDefaultPagePage } from '../cart-tab-default-page/cart-tab-default-page';
import { CloudTabDefaultPagePage } from '../perfil/cloud-tab-default-page';


@Component({
  selector: 'page-tabs-controller',
  templateUrl: 'tabs-controller.html'
})
export class TabsControllerPage {


 
  tab1Root: any = CameraTabDefaultPagePage;
  tab2Root: any = CartTabDefaultPagePage;
  tab3Root: any = CloudTabDefaultPagePage;

  constructor(
    public navCtrl: NavController,
    public navParam: NavParams,
    
    ) {
      
  }
 
  ionViewDidLoad(){
   
  } 

    
}

