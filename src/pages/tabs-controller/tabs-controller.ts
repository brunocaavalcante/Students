import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FeedPage } from '../feed/feed-page';
import { ChatsPage } from '../chats/chats-page';
import { PerfilPage } from '../perfil/perfil-page';

@Component({
  selector: 'page-tabs-controller',
  templateUrl: 'tabs-controller.html'
})
export class TabsControllerPage {



  tab1Root: any = FeedPage;
  tab2Root: any = ChatsPage;
  tab3Root: any = PerfilPage;

  constructor(
    public navCtrl: NavController,
    public navParam: NavParams,

  ) {

  }

  ionViewDidLoad() {

  }


}

