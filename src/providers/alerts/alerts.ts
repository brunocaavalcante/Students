import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';


@Injectable()
export class AlertsProvider {

  constructor(public http: HttpClient, public alertCtrl: AlertController) {
    console.log('Hello AlertsProvider Provider');
  }
  //Função para apresenta alertas
  presentAlert(title: string, subtitle: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: ['OK']
    });
    alert.present();
  }

 
}
