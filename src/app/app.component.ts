import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, NavController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TarefasPage } from '../pages/Projeto/myProjeto/tarefas';
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
    rootPage:any = TestePage;

  constructor(
    platform: Platform, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen,
    public storage: Storage,
    public afAuth: AngularFireAuth
    ) {
    platform.ready().then(() => {

      const user = this.afAuth.auth.currentUser; //pega usuario logado
      
        if(user != null){
          this.rootPage = TabsControllerPage;
        }else{
          this.rootPage = TestePage;
        }

      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  openProjeto(){
    this.navCtrl.push(ProjetosPage);
  }
 
  
}
