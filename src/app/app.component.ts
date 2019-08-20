import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { TabsControllerPage } from '../pages/tabs-controller/tabs-controller';
import { HomePage } from '../pages/home/home';
import { ProjetosPage } from '../pages/Projeto/projetos/projetos';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserProvider } from '../providers/user/user';
import { Observable } from 'rxjs';



@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) navCtrl: NavController;
  rootPage: any = this.rootPage;
  user;
  u:Observable<any>;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public storage: Storage,
    public afAuth: AngularFireAuth,
    public usuario: UserProvider
  ) {


    platform.ready().then(() => {
      this.user = this.afAuth.auth.currentUser; //pega usuario logado
      if (this.user != null) {
        this.rootPage = TabsControllerPage;
        this.u = this.usuario.find('id',this.user.uid);
      } else {
        this.rootPage = HomePage;
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
    this.afAuth.auth.signOut();
    this.navCtrl.setRoot(HomePage);
  }


}
