import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserProvider } from '../../providers/user/user';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil-page.html'
})
export class PerfilPage {

  filePhoto: File;
  user;
  list: Observable<any>;
  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;
  disable: string;
  updateForm: FormGroup;
  percent: number;

  constructor(
    public navCtrl: NavController,
    public afAuth: AngularFireAuth,
    public formbuilder: FormBuilder,
    public alertCtrl: AlertController,
    public usuario: UserProvider,
    public storage: AngularFireStorage
  ) {
    this.updateForm = this.formbuilder.group({
      sobrenome: [null, [Validators.required, Validators.minLength(3)]],
      semestre: [null],
      data_nasc: [null],
      faculdade: [null],
      campus: [null],
      situacao: [null],
      curso: [null],
      sexo: [null],
      nome: [null, [Validators.required, Validators.minLength(3)]],
      email: [null, [Validators.required, Validators.email]],
    })

    this.user = this.afAuth.auth.currentUser;//pega usuario logado
    this.disable = "1";
  }

  ionViewDidLoad() {
    this.list = this.usuario.find('email',this.user.email);
    this.disable = "1";
  }

  submitForm() {
    this.usuario.update(this.user.uid, this.updateForm.value);
    this.presentAlert("Cadastro Atalizado", "Cadastro atualizado com sucesso!");
    this.disable = "1";
  }

  public presentAlert(title: string, subtitle: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: ['OK']
    });
    alert.present();
  }

  uploadFile(event) {
    const file = event.target.files[0];
    const filePath = 'users/' + this.user.uid + "/" + file.name;
    const fileRef = this.storage.ref("users").child(this.user.uid + '/' + file.name);
    const task = this.storage.upload(filePath, file);
    this.uploadPercent = task.percentageChanges();
    this.uploadPercent.subscribe(itens => {
      this.percent = Math.round(itens);
    })
    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe(itens => {
          this.usuario.update(this.user.uid, { photo: itens });
        });
      })
    )
      .subscribe()
    this.percent = null;
  }

}


