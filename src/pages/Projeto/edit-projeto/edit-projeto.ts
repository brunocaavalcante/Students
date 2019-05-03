import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Item, AlertController } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AngularFireDatabase } from '@angular/fire/database';
import { ProjetosPage } from '../projetos/projetos';


@IonicPage()
@Component({
  selector: 'page-edit-projeto',
  templateUrl: 'edit-projeto.html',
})
export class EditProjetoPage {

  newProjectForm: FormGroup;
  p;
  check;
  participantes;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formbuilder: FormBuilder,
    public db: AngularFireDatabase,
    public alertCtrl: AlertController,) {

    this.newProjectForm = this.formbuilder.group({
      descricao: [null, [Validators.required, Validators.minLength(10)]],
      data_ini: [null],
      data_fim: [null],
      faculdade: [null],
      campus: [null],
      funcao: [null],
      email: [null],
      nome: [null, [Validators.required, Validators.minLength(5)]],
      adm: [null]
    })
    this.p = this.navParams.get('p');
    this.participantes = this.navParams.get('participantes');
  }

  ionViewDidLoad() {
  }

  alterProjeto() {
    
    this.db.database.ref('projetos').orderByChild('id').
      equalTo(this.p.id).on("value", snapshot => {
        snapshot.forEach(data => {
          this.db.database.ref('projetos/' + data.key).update({
            descricao: this.newProjectForm.get('descricao').value,
            id: this.p.id,
            nome: this.newProjectForm.get('nome').value,
            faculdade: this.newProjectForm.get('faculdade').value,
            data_ini: this.newProjectForm.get('data_ini').value,
            data_fim: this.newProjectForm.get('data_fim').value,
            campus: this.newProjectForm.get('campus').value
          });
        });
      });
      this.presentAlert("Projeto alterado!","");
      this.navCtrl.push(ProjetosPage);
    
  }

  updateCheck(item) {

    console.log(item);
    this.check = item.adm;
    this.db.database.ref('projetos').orderByChild('id').equalTo(this.p.id)
      .on("value", snapshot => {
        snapshot.forEach(data => {
          if (data.val().id_participante == item.email) {
            this.db.database.ref('projetos/' + data.key).update({ adm: this.check });
          }
        });
      })
  }

   //Função para apresenta alertas
   public presentAlert(title: string, subtitle: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: ['OK']
    });
    alert.present();
  }

}
