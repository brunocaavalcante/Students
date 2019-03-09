import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MenuController } from 'ionic-angular';
import { TarefasPage } from '../tarefas/tarefas';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { identifierModuleUrl } from '@angular/compiler';


@IonicPage()
@Component({
  selector: 'page-projetos',
  templateUrl: 'projetos.html',
})
export class ProjetosPage {

  operacao = false ;
  participante=[{
    status:true
  }]; 
  count = 0;
  newProjectForm: FormGroup;
  

  
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public formbuilder: FormBuilder,
    public storage: Storage ) {
    
      this.operacao = false ;
       //Validação dos campos
       this.newProjectForm = this.formbuilder.group({
        descricao:[null,[Validators.required,Validators.minLength(20)]],
        data_ini:[null],
        data_fim:[null],
        faculdade:[null],
        campus:[null],
        funcao:[null],
        email:[null],
        name:[null,[Validators.required,Validators.minLength(5)]],
      })
  }

  ionViewDidLoad() {
    console.log(this.operacao);
    this.closeMenu();
  }
  closeMenu() {
    this.menuCtrl.close();
  }
  goToProjetos(){
    this.navCtrl.push(TarefasPage);
  }
  createProjeto(){
    this.operacao = true;
  }

  addParticipante(){
   
    this.participante[this.count] = {status:true};
    this.count = this.count+1
    console.log(this.participante);
    
  }
  removeParticipante(){

    this.participante[this.count-1] = null;
    this.count = this.count - 1;
  }

}
