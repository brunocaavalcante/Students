import { Component, ViewChild } from '@angular/core';
import { NavController, Segment, AlertController } from 'ionic-angular';
import { FindChatsPage } from '../Menssagens/find-chats/find-chats';
import { MessagePage } from '../Menssagens/message/message';
import { UserProvider } from '../../providers/user/user';
import { AngularFireAuth } from '@angular/fire/auth';
import { ChatsProvider } from '../../providers/chats/chats';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';
import { NewGrupMessagePage } from '../Menssagens/new-grup-message/new-grup-message';

@Component({
  selector: 'page-chats',
  templateUrl: 'chats-page.html'
})

export class ChatsPage {

  campus;
  faculdade;
  curso;
  mostrar = true;
  sexo;
  user;
  grupos = [];
  contacts: Observable<any>;
  messages: Observable<any>;
  startAt = new Subject();
  endAt = new Subject();
  startobs = this.startAt.asObservable();
  endobs = this.endAt.asObservable();

  @ViewChild(Segment) segment: Segment;

  constructor(
    public navCtrl: NavController,
    public usuario: UserProvider,
    public chats: ChatsProvider,
    public afth: AngularFireAuth,
    public alertCtrl: AlertController) {
    this.user = this.afth.auth.currentUser;
    this.getMessages();
    this.getContato();
    this.getGrupos();
  }

  ionViewDidLoad() {
    this.segment.value = 'conversas';
  }

  deleteGrupo(item){
    this.chats.deleteGrupo(item,this.user.uid);
    
  }

  goToMessage(item) {
    this.navCtrl.push(MessagePage, { item });
  }

  goToFindChats() {
    var p = {
      campus: this.campus,
      faculdade: this.faculdade,
      curso: this.curso,
      sexo: this.sexo == "todos" ? "" : this.sexo
    }
    console.log(p);
    this.navCtrl.push(FindChatsPage, { p });
  }

  goToNewgrup() {
    this.navCtrl.push(NewGrupMessagePage);
  }

  getMessages() {
    this.messages = this.chats.chatsUser(this.user.uid);
    this.chats.chatsUser(this.user.uid).subscribe(item => {
      if (item.length > 0) {
        item.forEach(data => {
          this.usuario.find('id', data.id).subscribe(itens => {
            if (data.photo != itens[0].photo) {
              data.photo = itens[0].photo;
              this.chats.insertChat(data, this.user.uid, data.id);
            }
          })
        });
      }
    })
  }

  getContato() {
    this.contacts = this.chats.getContatos(this.user.uid);
    this.chats.getContatos(this.user.uid).subscribe(itens => {
      if (itens) {
        itens.forEach(contato => {
          this.usuario.find('id', contato.id).subscribe(user => {
            if (user.photo != contato.photo) {
              contato.photo = user[0].photo;
              this.chats.addContato(this.user.uid, contato);
            }
          })
        });
      }
    })
  }

  getGrupos() {
    let tem: boolean = false;
    this.chats.getGrupos(this.user.uid).subscribe(itens => {
      itens.forEach(item => {
        this.chats.findGrupo(item.id).subscribe(i => {
          if (this.grupos.length > 0) {
            this.grupos.forEach(dt => {
              if (dt.id == i.id) { tem = true; }
            });
            if (!tem) {
              this.grupos.push(i);
            }
          } else { this.grupos.push(i) }
        })
      });
    })
  }

  limpar() {
    this.campus = "";
    this.curso = "";
    this.faculdade = "";
    this.sexo = "";
  }

  presentShowConfirm(item) {

    const alert = this.alertCtrl.create({
      title: "Excluir o Grupo?",
      message: "A exclusão será permanente",
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
            this.deleteGrupo(item);
          }
        }
      ]
    });
    alert.present();
  }

  searchbar(item) {
    this.mostrar = item;
  }

  fliterItems(event: any): void {
    let filter: string = event.target.value;
    filter = filter.charAt(0).toUpperCase() + filter.slice(1);//Transforma a primeira letra em maiuscula
    this.startAt.next(filter);
    this.endAt.next(filter + "\uf8ff");
    let ref: string;
    if (filter) {
      switch ("" + this.segment) {

        case 'contatos': {
          ref = 'chats/' + this.user.uid + "/contatos";
          Observable.combineLatest(this.startobs, this.endobs).subscribe(item => {
            this.contacts = this.chats.filter(ref, 'nome', item[0], item[1]);
          });
          break;
        }

        case 'conversas': {
          ref = 'chats/' + this.user.uid + "/messages";
          Observable.combineLatest(this.startobs, this.endobs).subscribe(item => {
            this.messages = this.chats.filter(ref, 'nome', item[0], item[1]);
          });
          break;
        }
      }
    }
  }
}
