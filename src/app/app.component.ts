import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, NavController, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { TabsControllerPage } from '../pages/tabs-controller/tabs-controller';
import { TestePage } from '../pages/teste/teste';
import { ProjetosPage } from '../pages/Projeto/projetos/projetos';
import { AngularFireAuth } from '@angular/fire/auth';



@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) navCtrl: NavController;
    rootPage:any = this.rootPage;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public storage: Storage,
    public menuCtrl: MenuController,
    public afAuth: AngularFireAuth
  ) {

    platform.ready().then(() => {

      const user = this.afAuth.auth.currentUser; //pega usuario logado

      if (user != null) {
        this.rootPage = TabsControllerPage;
      } else {
        this.rootPage = TestePage;
      }

      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  openProjeto() {
    this.navCtrl.push(ProjetosPage);
  }
  
  Logout() {
    this.storage.set("user", null); // Salvando o id do usuario no sqlite
    this.navCtrl.setRoot(TestePage);
    this.menuCtrl.close(); 
  }


}
