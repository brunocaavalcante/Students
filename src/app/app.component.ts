import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, NavController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TarefasPage } from '../pages/tarefas/tarefas';
import { Storage } from '@ionic/storage';
import { TabsControllerPage } from '../pages/tabs-controller/tabs-controller';
import { TestePage } from '../pages/teste/teste';
import { ProjetosPage } from '../pages/projetos/projetos';



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
    public storage: Storage
    ) {
    platform.ready().then(() => {

      this.storage.get('user')
      .then((resolver)=>{
      
        if(resolver != null){
          this.rootPage = TabsControllerPage;
        }else{
          this.rootPage = TestePage;
        }
      })
      .catch(()=>{
        this.rootPage = TestePage;
      })

      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  openProjeto(){
    this.navCtrl.push(ProjetosPage);
  }
 
  
}
