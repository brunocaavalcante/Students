import { Component, ViewChild } from '@angular/core';
import { NavController, Platform, Segment } from 'ionic-angular';
import { ChatPage } from '../Menssagens/chat/chat';

@Component({
  selector: 'page-cart-tab-default-page',
  templateUrl: 'cart-tab-default-page.html'
})
export class CartTabDefaultPagePage {

@ViewChild(Segment) segment: Segment;

  constructor(public navCtrl: NavController) {
    
  }
  ionViewDidLoad() {
    this.segment.value ='conversas';
  }

  goToChat(){
    this.navCtrl.push(ChatPage);
  }

 
}
