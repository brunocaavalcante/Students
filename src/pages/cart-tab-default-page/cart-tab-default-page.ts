import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { ChatPage } from '../chat/chat';

@Component({
  selector: 'page-cart-tab-default-page',
  templateUrl: 'cart-tab-default-page.html'
})
export class CartTabDefaultPagePage {

  constructor(public navCtrl: NavController) {
    
  }

  goToChat(){
    this.navCtrl.push(ChatPage);
  }

 
}
