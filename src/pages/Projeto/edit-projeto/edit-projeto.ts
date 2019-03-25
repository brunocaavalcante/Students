import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AngularFireDatabase } from '@angular/fire/database';
import { TarefasPage } from '../myProjeto/tarefas';
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
    public db: AngularFireDatabase) {

    this.newProjectForm = this.formbuilder.group({
      descricao: [null, [Validators.required, Validators.minLength(10)]],
      data_ini: [null],
      data_fim: [null],
      faculdade: [null],
      campus: [null],
      funcao: [null],
      email: [null],
      nome: [null, [Validators.required, Validators.minLength(5)]],
      adm:[null]
    })
    this.p = this.navParams.get('p');
    this.participantes = this.navParams.get('participantes');
    console.log(this.p);
  }

  ionViewDidLoad() {

  }

  alterProjeto() {

    this.db.database.ref('projetos').orderByChild('id').
      equalTo(this.p.id).on("value", snapshot => {
        snapshot.forEach(data => {
          this.db.database.ref('projetos/' + data.key).update(this.newProjectForm.value);
        });
      });
      this.navCtrl.push(ProjetosPage);
  }
  updateCheck(item) {
    this.check = this.newProjectForm.get('adm').value;
    console.log(item);
    //this.db.database.ref('projetos/' + item.id).update({ adm: this.check });
  }
  
}
