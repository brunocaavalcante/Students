import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform } from 'ionic-angular';
import { MenuController } from 'ionic-angular';
import { TarefasPage } from '../myProjeto/tarefas';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { CameraOptions, Camera } from '@ionic-native/camera';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { File } from '@ionic-native/file';


@IonicPage()
@Component({
  selector: 'page-projetos',
  templateUrl: 'projetos.html',
})
export class ProjetosPage {

  operacao = false;
  participante = [{
    id: "",
    email: ""
  }];
  listProjetos = [];
  id_projeto;
  newProjectForm: FormGroup;
  list = [];
  user;
  delete;
  pj;
  uemail;
  public uploadPercent: Observable<number>;
  public downloadUrl: Observable<string>;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public formbuilder: FormBuilder,
    public storage: Storage,
    public afAuth: AngularFireAuth,
    private afStorage: AngularFireStorage,
    public alertCtrl: AlertController,
    private platform: Platform,
    public db: AngularFireDatabase,
    private camera: Camera,
    private file: File) {

    this.operacao = false;
    //Validação dos campos
    this.newProjectForm = this.formbuilder.group({
      descricao: [null, [Validators.required, Validators.minLength(10)]],
      data_ini: [null],
      data_fim: [null],
      faculdade: [null, [Validators.required]],
      campus: [null, [Validators.required]],
      funcao: [null, [Validators.required]],
      nome: [null, [Validators.required, Validators.minLength(5)]],
    })
    this.user = this.afAuth.auth.currentUser;//pega usuario logado
  }

  ionViewDidLoad() {
    this.user = this.afAuth.auth.currentUser;//pega usuario logado
    this.getProjetos();
    this.closeMenu();
  }

  closeMenu() {
    this.menuCtrl.close();
  }

  createProjeto() {

    this.id_projeto = this.db.database.ref('projetos').push().key// criar projeto
    this.participante.push({ id: "", email: this.user.email });
    //verifica se o participante esta cadastrado no sistema 
    if (this.id_projeto != null) {
      for (let i = 1; i < this.participante.length; i++) {


        this.db.database.ref('cadastro').orderByChild("email")
          .equalTo(this.participante[i].email).once("value", snapshot => {
            const items = snapshot.val();

            if (items != null) {

              //Inseri participante no projeto
              this.list = Object.keys(items).map(i => items[i]);

              this.db.database.ref('projetos/').push({
                descricao: this.newProjectForm.get('descricao').value,
                data_ini: this.newProjectForm.get('data_ini').value,
                data_fim: this.newProjectForm.get('data_fim').value,
                faculdade: this.newProjectForm.get('faculdade').value,
                campus: this.newProjectForm.get('campus').value,
                nome: this.newProjectForm.get('nome').value,
                id: this.id_projeto,
                id_participante: this.list[0].email,
                situacao: "ativo",
                dono: this.user.email,
                adm: (this.list[0].email == this.user.email ? "true" : "false"),
                status: 0

              })

            } else {
              var id = this.db.database.ref('cadastro').push().key
              this.db.database.ref('cadastro/' + id).update({ // Cria pré cadastro
                email: this.participante[i].email,
                id: id
              })
              this.db.database.ref('projetos/').push({  //Insere no projeto
                descricao: this.newProjectForm.get('descricao').value,
                data_ini: this.newProjectForm.get('data_ini').value,
                data_fim: this.newProjectForm.get('data_fim').value,
                faculdade: this.newProjectForm.get('faculdade').value,
                campus: this.newProjectForm.get('campus').value,
                nome: this.newProjectForm.get('nome').value,
                id: this.id_projeto,
                status: 0,
                situacao: "ativo",
                id_participante: this.participante[i].email,
                adm: "false"
              })
            }
          });
      }
    }
    this.presentAlert("Projeto " + this.newProjectForm.get('nome').value, "Projeto criado com sucesso");
    this.operacao = false;
    var rm = this.db.database.ref('projetos/' + this.id_projeto);
    rm.remove();
  }

  getProjetos() {
    this.db.database.ref('projetos').orderByChild("id_participante")
      .equalTo(this.user.email).on("value", snapshot => {
        let i = 0;
        if (snapshot) {
          snapshot.forEach(data => {
            this.list[i] = data.val();
            i++;
          });
        }
      });
  }

  goToProjetos(item) {

    var projeto = {
      nome: item.nome,
      descricao: item.descricao,
      data_ini: item.data_ini,
      data_fim: item.data_fim,
      faculdade: item.faculdade,
      id: item.id,
      adm: item.adm,
      campus: item.campus,
      dono: item.dono,
      id_participante: item.id_participante
    }

    this.navCtrl.push(TarefasPage, { projeto });
  }

  addProjeto() {
    this.operacao = true;
  }

  async openGalery() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      correctOrientation: true
    }
    try {

      const fileUri: String = await this.camera.getPicture(options);
      let file: string;

      if (this.platform.is('ios')) {
        file = fileUri.split('/').pop();
      }
      else {
        file = fileUri.substring(fileUri.lastIndexOf('/') + 1, fileUri.indexOf('?'));
      }

      const path: string = fileUri.substring(0, fileUri.lastIndexOf('/'));
      //Ler como arquivo binario
      const buffer: ArrayBuffer = await this.file.readAsArrayBuffer(path, file);
      //Transforma o arquivo em imagem
      const blob: Blob = new Blob([buffer], { type: 'image/jpeg' });

      this.uploadPicture(blob);

    } catch (error) {
      console.error(error);
    }
  }

  uploadPicture(blob: Blob) {
    const ref = this.afStorage.ref('imagens/chatbot.jpg');
    const task = ref.put(blob);

    this.uploadPercent = task.percentageChanges();
    task.snapshotChanges().pipe(
      finalize(() => this.downloadUrl = ref.getDownloadURL())
    ).subscribe();

    console.log(this.downloadUrl);
  }

  removeParticipante() {
    this.participante.pop();
  }

  removeProjeto(id: string) {
    //this.tarefas.deleteAll(id); //Deletas todas as tarefas referente ao projeto excluido

    this.db.database.ref('projetos').orderByChild("id")
      .equalTo(id).on("value", snapshot => {
        snapshot.forEach(item => {
          var rv = this.db.database.ref('projetos/' + item.key);
          rv.remove();
        });

      });
    this.presentAlert("Projeto removido com sucesso", "");

  }

  presentAlert(title: string, subtitle: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: ['OK']
    });
    alert.present();
  }

  presentPrompt() {
    let alert = this.alertCtrl.create({
      title: 'Participante',
      inputs: [
        {
          name: 'email',
          placeholder: 'Digite o Email do Participante',
          type: 'email'
        },

      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {

          }
        },
        {
          text: 'OK',
          handler: data => {
            this.participante.push(data);
          }
        }
      ]
    });
    alert.present();
  }

  presentShowConfirm(id) {

    const alert = this.alertCtrl.create({
      title: "Atenção deseja excluir o projeto?",
      message: "A exclusão será permanente",
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            alert.dismiss(false);
            return false;;
          }
        },
        {
          text: 'Excluir',
          role: 'excluir',
          handler: () => {
            this.removeProjeto(id);
          }
        }
      ]
    });
    alert.present();
    alert.onDidDismiss((data) => {
      this.delete = data;
    });
  }



}
