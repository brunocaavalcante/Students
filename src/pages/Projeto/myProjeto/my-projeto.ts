import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Segment } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { MenuController } from 'ionic-angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { TarefasProjetoPage } from '../tarefas-projeto/tarefas-projeto';
import { EditProjetoPage } from '../edit-projeto/edit-projeto';
import { DespesasPage } from '../despesas/despesas';
import { ProjetoProvider } from '../../../providers/projeto/projeto-provider';
import { UserProvider } from '../../../providers/user/user';
import { ChatsProvider } from '../../../providers/chats/chats';
import { Observable } from 'rxjs';
import { TabsControllerPage } from '../../tabs-controller/tabs-controller';



@IonicPage()
@Component({
  selector: 'page-my-projeto',
  templateUrl: 'my-projeto.html',
})
export class MyProjetoPage {

  tarefa;
  descricao;
  participantes;
  item = { email: "", funcao: "", desc_f: "" };
  p;
  adm: boolean;
  user;
  list = [];
  projeto;
  items: Observable<any>;
  itens = [];
  id;
  @ViewChild(Segment) segment: Segment;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,//Variavel banco de dados local do app sqlite
    public alertCtrl: AlertController,
    public menuCtrl: MenuController,
    public pj: ProjetoProvider,
    private usuario: UserProvider,
    public chats: ChatsProvider,
    public afAuth: AngularFireAuth,

  ) {
    var u = this.afAuth.auth.currentUser;//pega usuario logado
    this.usuario.find('id', u.uid).subscribe(itens => {
      this.user = itens[0];
    });
    this.projeto = this.navParams.get('projeto');
    this.getMessages();
    this.OrdenarMessages(this.items);
    console.log(this.projeto);
  }

  ionViewDidLoad() {
    this.segment.value = 'sobre';
    this.getParticipantes();
  }

  deleteParticipante(item) {
    this.pj.deleteParticipante(item.id_participante);
    this.presentAlert("Participante Excluido", "");
    this.list.pop();
  }

  finalizarProjeto() {
    for (let i = 0; i < this.list.length; i++) {
      this.pj.update(this.list[i].id_participante, { situacao: "finalizado", status: 100 });
    }
  }

  getParticipantes() {
    this.pj.find(this.projeto).subscribe(itens => {
      var participantes = Object.keys(itens).map(i => itens[i]);
      if (participantes.length > 0) {
        for (let i = 0; i < participantes.length; i++) {
          this.usuario.find('email', participantes[i].email).subscribe(data => {
            this.p = Object.keys(data).map(i => data[i]);
            if (this.p.length > 0) {
              this.list[i] = ({
                nome: this.p[0].nome,
                sobrenome: this.p[0].sobrenome,
                faculdade: this.p[0].faculdade,
                curso: this.p[0].curso,
                id_participante: participantes[i].id_participante,
                id: participantes[i].id,
                funcao: participantes[i].funcao,
                desc_f: participantes[i].descricao_f,
                email: participantes[i].email,
                adm: participantes[i].adm,
                photo: this.p[0].photo
              });
            } else {
              this.list[i] = ({
                id_participante: participantes[i].id_participante,
                id: participantes[i].id,
                funcao: participantes[i].funcao,
                desc_f: participantes[i].descricao_f,
                email: participantes[i].email,
                adm: participantes[i].adm
              });
            }
          });
        }
      }
    })
  }

  getMessages() {
    this.items = this.chats.getMessagesGrupo(this.projeto.id);
  }

  goToTarefas(participante) {
    var p = this.projeto;
    this.navCtrl.push(TarefasProjetoPage, { p, participante });
  }

  goToEditProjeto() {
    var p = this.projeto;
    var participantes = this.list;
    this.navCtrl.push(EditProjetoPage, { p, participantes });
  }

  goToDespesas() {
    var projeto = this.projeto
    this.navCtrl.push(DespesasPage, { projeto });
  }

  insertParticipante(item) {
    this.projeto.email = item.email;
    this.projeto.adm = false;
    this.pj.insert(this.projeto);
    this.projeto.adm = true;
    this.presentAlert("Participante adicionado", "");

  }

  OrdenarMessages(messages: Observable<any>) {
    messages.subscribe(itens => {
      itens.sort(function (x, y) {
        return x.timestamp - y.timestamp;
      });
      this.itens = itens;
    });
  }

  public presentAlert(title: string, subtitle: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: ['OK']
    });
    alert.present();
  }

  presentPrompt(item, op) {

    let alert = this.alertCtrl.create({
      title: 'Participante',
      inputs: [
        {
          name: 'email',
          placeholder: 'Digite o Email do Participante',
          type: 'email',
          value: item.email
        },
        {
          name: 'funcao',
          placeholder: 'Função',
          type: 'text',
          value: item.funcao
        },
        {
          name: 'descricao_f',
          placeholder: 'Descreva a Função',
          type: 'text',
          value: item.desc_f
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
          text: 'ok!',
          handler: data => {

            if (op == "update") {
              this.updateParticipante(data, item);
            } else {
              this.insertParticipante(data);
            }
          }
        }
      ]
    });
    alert.present();
  }

  presentShowConfirm(item) {

    const alert = this.alertCtrl.create({
      title: "Excluir o Participante",
      message: "Deseja realmente excluir o participante do projeto?",
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {

          }
        },
        {
          text: 'Excluir',
          role: 'excluir',
          handler: () => {
            this.deleteParticipante(item);
          }
        }
      ]
    });
    alert.present();
  }

  presentShow(op) {
    let titulo, sub, btn;

    if (op == 'finalizar') {
      titulo = "Deseja Finalizar o Projeto?";
      sub = "Esse projeto irá para area de projetos finalizados"
      btn = "Finalizar"
    } else {
      titulo = "Deseja Sair do Projeto?";
      sub = "O voçê não terá mais acesso a esse projeto a menos que seja novamente convidado a participar do projeto."
      btn = "Sair"
    }
    const alert = this.alertCtrl.create({
      title: titulo,
      message: sub,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {

          }
        },
        {
          text: btn,
          role: btn,
          handler: () => {
            if (btn == "Finalizar") {
              this.finalizarProjeto();
            } else {
              this.sairProjeto();
            }
          }
        }
      ]
    });
    alert.present();
  }

  sairProjeto() {
    if (this.projeto.dono == this.user.email) {
      this.presentAlertRadio();
    }
    this.pj.delete(this.projeto);
    this.presentAlert("Você já não pertence ao projeto", "Você ja não é mais um participante do projeto");
    this.navCtrl.setRoot(TabsControllerPage);
  }

  async presentAlertRadio() {
    const alert = await this.alertCtrl.create({
      subTitle: 'Escolha um integrante para ser o novo adm do Projeto',

      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'danger',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            this.updateDonoProjeto(data);
          }
        }
      ]
    });
    this.list.forEach(p => {

      if (this.user.email != p.email) {
        alert.addInput(
          {
            name: 'checkbox6',
            type: 'checkbox',
            label: p.email,
            value: p
          }
        )
      }
    });
    await alert.present();
  }

  sendMessage(newMessage: string): void {
    var date = new Date();
    var time = date.getTime();

    if (newMessage) {
      let msg = {
        id_user: this.user.id,
        timestamp: time,
        msg: newMessage,
        nome: this.user.nome + " " + this.user.sobrenome,
        photo: this.user.photo
      };
      var ref = this.projeto.id;
      this.chats.insertMessages(ref, msg);
    }
  }


  updateParticipante(data, item) {
    this.pj.update(item.id_participante, data);
  }

  updateDonoProjeto(item) {
    console.log(item);
    for (let i = 0; i < this.list.length; i++) {
      this.pj.update(this.list[i].id_participante, { dono: item[0].email });
    }
    item.forEach(p => {
      this.pj.update(p.id_participante, { adm: true });
    });
  }

}
