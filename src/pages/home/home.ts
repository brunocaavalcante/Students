import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CadastroUserPage } from '../Usuario/cadastro-user/cadastro-user';
import { LoginPage } from '../login/login';
import { Storage } from '@ionic/storage';
import { TabsControllerPage } from '../tabs-controller/tabs-controller';
import { AngularFireAuth } from '@angular/fire/auth';


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public afAuth: AngularFireAuth,
    public storage: Storage
     ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TestePage');
  }

  goToCadastroUser(){
    this.navCtrl.push(CadastroUserPage);
  }
  goToLogin(){
    this.navCtrl.push(LoginPage);
  }
   //Função que verifica se o usuario estar autenticado para que ele não precise se autenticar a cada atualização
   ionViewCanEnter(){
    this.storage.get('user')
    .then((resolver)=>{
      if(resolver != null){//verificando se o usuario é maior que 0 pois ai ele ja está logado no app
        this.navCtrl.push(TabsControllerPage);
      }
    })
  }

}
