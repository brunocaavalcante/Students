import { Component, Input } from '@angular/core';
import { AlertController, NavController } from 'ionic-angular';
import { ChatsProvider } from '../../providers/chats/chats';
import { ProjetoProvider } from '../../providers/projeto/projeto-provider';
import { MyProjetoPage } from '../../pages/Projeto/myProjeto/my-projeto';

@Component({
  selector: 'show-projetcs',
  templateUrl: 'show-projetcs.html'
})
export class ShowProjetcsComponent {

  @Input() pj;

  constructor(
    public alertCtrl: AlertController,
    public chats: ChatsProvider,
    public projeto: ProjetoProvider,
    public navCtrl: NavController) {

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

        this.projeto.presentShowConfirm(data, "Atenção deseja excluir o projeto?", "A exclusão será permanente", "projeto");
      });
    });
  }

  goToProjeto(item) {
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
      url: item.url,
      situacao: item.situacao || ''
    }

    this.navCtrl.push(MyProjetoPage, { projeto });
  }

}
