import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AngularFireDatabase } from '@angular/fire/database';
import { ProjetosPage } from '../projetos/projetos';
import { ProjetoProvider } from '../../../providers/projeto/projeto-provider';


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
    public pj:ProjetoProvider,
    public db: AngularFireDatabase,
    public alertCtrl: AlertController,) {

    this.newProjectForm = this.formbuilder.group({
      descricao: [null, [Validators.required, Validators.minLength(10)]],
      data_ini: [[null],[Validators.required]],
      data_fim: [[null],[Validators.required]],
      faculdade: [[null],[Validators.required]],
      campus: [[null],[Validators.required]],
      nome: [null, [Validators.required, Validators.minLength(5)]],
    })
    this.p = this.navParams.get('p');
    this.participantes = this.navParams.get('participantes');
  }

  ionViewDidLoad() {
  }

  alterProjeto() {
    
   this.pj.find(this.p).subscribe(itens=>{
    var data = Object.keys(itens).map(i => itens[i]);
    data.forEach(dt => {
      this.pj.update(dt.id_participante,this.newProjectForm.value);
    });
   })
  }

  updateCheck(item) {

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
