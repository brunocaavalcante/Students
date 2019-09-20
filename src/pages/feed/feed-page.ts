import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CameraOptions, Camera } from '@ionic-native/camera';
import { ProjetoProvider } from '../../providers/projeto/projeto-provider';
import { Observable } from 'rxjs';

@Component({
  selector: 'page-feed',
  templateUrl: 'feed-page.html'
})
export class FeedPage {
  foto: any;
  items: Observable<any>;

  constructor(
    public navCtrl: NavController,
    public camera: Camera,
    public projetos: ProjetoProvider) {
  }

  ionViewDidLoad() {
    this.items = this.projetos.get({ adm: true });
  }

  OpenCamera() {
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      this.foto = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      // Handle error
    });
  }
}
