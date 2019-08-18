import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Loading, LoadingController } from 'ionic-angular';
import { MyProjetoPage } from '../myProjeto/my-projeto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { UserProvider } from '../../../providers/user/user';
import { ProjetoProvider } from '../../../providers/projeto/projeto-provider';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { ChatsProvider } from '../../../providers/chats/chats';

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
  id = null;
  img; percent;
  newProjectForm: FormGroup;
  user;
  profileUrl: Observable<string | null>;
  list = [];
  public uploadPercent: Observable<number>;
  public downloadUrl: Observable<string>;
  items: Observable<any>;
  ref;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formbuilder: FormBuilder,
    private storage: AngularFireStorage,
    public afAuth: AngularFireAuth,
    public alertCtrl: AlertController,
    public usuario: UserProvider,
    public projeto: ProjetoProvider,
    public chats: ChatsProvider,
    private afs: AngularFirestore,
    public loadingCtrl: LoadingController,
  ) {
    this.user = this.afAuth.auth.currentUser;//pega usuario logado
    this.operacao = false;
    let loading: Loading = this.showLoading();
    this.items = this.projeto.get(this.user.email);
    this.items.subscribe(i => {
      console.log(i);
    })
    setTimeout(() => {
      loading.dismiss();
    }, 1200)
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
  }

  ionViewDidLoad() {

  }

  createProjeto() {
    this.id = this.afs.createId();
    this.participante.push({ id: "", email: this.user.email });
    //verifica se o participante esta cadastrado no sistema 
    for (let i = 1; i < this.participante.length; i++) {

      var pj = {
        descricao: this.newProjectForm.get('descricao').value,
        data_ini: this.newProjectForm.get('data_ini').value,
        data_fim: this.newProjectForm.get('data_fim').value,
        faculdade: this.newProjectForm.get('faculdade').value,
        campus: this.newProjectForm.get('campus').value,
        nome: this.newProjectForm.get('nome').value,
        email: this.participante[i].email,
        situacao: "ativo",
        id: this.id,
        dono: this.user.email,
        adm: (this.participante[i].email == this.user.email ? true : false),
        status: 0,
        url: (this.img || '')
      };
      this.projeto.insert(pj);
    }
    this.presentAlert("Projeto " + this.newProjectForm.get('nome').value, "Projeto criado com sucesso");
    this.operacao = false;
  }

  goToProjetos(item) {
    console.log(item);
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
      id_participante: item.id_participante,
      url: item.url
    }

    this.navCtrl.push(MyProjetoPage, { projeto });
  }

  addProjeto() {
    this.operacao = true;
  }

  deleteProjeto(item) {
    this.chats.getMessagesGrupo(item.id).subscribe(itens => {
      itens.forEach(msg => {
        this.chats.deleteMessages(item.id, msg.id);
      });
    });
    this.projeto.find(item).subscribe(itens => {
      var p = Object.keys(itens).map(i => itens[i]);
      p.forEach(data => {
        this.projeto.delete(data);
      });
    });
    this.presentAlert("Projeto Excluido", "Projeto excluido com sucesso!");
  }

  removeParticipante() {
    this.participante.pop();
  }

  private showLoading(): Loading {

    let loading: Loading = this.loadingCtrl.create({
      content: "Carregando ..."
    });
    loading.present();
    return loading;
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

  presentShowConfirm(pj) {

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
            this.deleteProjeto(pj);
          }
        }
      ]
    });
    alert.present();
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

  uploadFile(event) {
    this.id = this.afs.createId();
    const file = event.target.files[0];
    const filePath = 'projetos/' + this.id + "/" + file.name;
    const fileRef = this.storage.ref("projetos").child(this.id + '/' + file.name);
    const task = this.storage.upload(filePath, file);
    this.uploadPercent = task.percentageChanges();
    this.uploadPercent.subscribe(itens => {
      this.percent = Math.round(itens);
    })
    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe(itens => {
          this.img = itens;
        });
      })
    )
      .subscribe()
    this.percent = null;
  }

}
