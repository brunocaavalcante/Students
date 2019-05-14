import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { CameraTabDefaultPagePage } from '../pages/camera-tab-default-page/camera-tab-default-page';
import { CartTabDefaultPagePage } from '../pages/cart-tab-default-page/cart-tab-default-page';
import { CloudTabDefaultPagePage } from '../pages/perfil/cloud-tab-default-page';
import { TabsControllerPage } from '../pages/tabs-controller/tabs-controller';
import { TestePage } from '../pages/teste/teste';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { CadastroUserPage } from '../pages/Usuario/cadastro-user/cadastro-user';
import { ChatPage } from '../pages/Menssagens/chat/chat';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFireAuth } from '@angular/fire/auth';
import { TarefasPage } from '../pages/Projeto/myProjeto/tarefas';
import { IonicStorageModule } from '@ionic/storage';
import { AngularFireDatabase } from '@angular/fire/database';
import { ProjetosPage } from '../pages/Projeto/projetos/projetos';
import { TarefasProjetoPage } from '../pages/Projeto/tarefas-projeto/tarefas-projeto';
import { EditProjetoPage } from '../pages/Projeto/edit-projeto/edit-projeto';
import { DespesasPage } from '../pages/Projeto/despesas/despesas';


@NgModule({
  declarations: [
    MyApp,
    CameraTabDefaultPagePage,
    CartTabDefaultPagePage,
    CloudTabDefaultPagePage,
    TabsControllerPage,
    TestePage,
    LoginPage,
    CadastroUserPage,
    ChatPage,
    TarefasPage,
    EditProjetoPage,
    ProjetosPage,
    TarefasProjetoPage,
    DespesasPage
       
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(environment.firebase),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    CameraTabDefaultPagePage,
    CartTabDefaultPagePage,
    CloudTabDefaultPagePage,
    TabsControllerPage,
    TestePage,
    LoginPage,
    CadastroUserPage,
    ChatPage,
    EditProjetoPage,
    TarefasPage,
    ProjetosPage,
    TarefasProjetoPage,
    DespesasPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AngularFireAuth,
    AngularFireDatabase,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {
  
 
}