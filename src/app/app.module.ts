import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { FeedPage } from '../pages/feed/feed-page';
import { ChatsPage } from '../pages/chats/chats-page';
import { PerfilPage } from '../pages/perfil/perfil-page';
import { TabsControllerPage } from '../pages/tabs-controller/tabs-controller';
import { HomePage } from '../pages/home/home';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { CadastroUserPage } from '../pages/Usuario/cadastro-user/cadastro-user';
import { ChatPage } from '../pages/Menssagens/chat/chat';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFireAuth } from '@angular/fire/auth';
import { MyProjetoPage } from '../pages/Projeto/myProjeto/my-projeto';
import { IonicStorageModule } from '@ionic/storage';
import { AngularFireDatabase } from '@angular/fire/database';
import { ProjetosPage } from '../pages/Projeto/projetos/projetos';
import { TarefasProjetoPage } from '../pages/Projeto/tarefas-projeto/tarefas-projeto';
import { EditProjetoPage } from '../pages/Projeto/edit-projeto/edit-projeto';
import { SubTarefasPage } from '../pages/Projeto/sub-tarefas/sub-tarefas';
import { DespesasPage } from '../pages/Projeto/despesas/despesas';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { AngularFireStorage } from '@angular/fire/storage';
import { UserProvider } from '../providers/user/user';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { ProjetoProvider } from '../providers/projeto/projeto-provider';
import { TarefaProvider } from '../providers/tarefa/tarefa';
import { SubtarefaProvider } from '../providers/subtarefa/subtarefa';


@NgModule({
  declarations: [
    MyApp,
    FeedPage,
    PerfilPage,
    ChatsPage,
    TabsControllerPage,
    HomePage,
    LoginPage,
    CadastroUserPage,
    ChatPage,
    MyProjetoPage,
    EditProjetoPage,
    ProjetosPage,
    TarefasProjetoPage,
    DespesasPage,
    SubTarefasPage

  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(environment.firebase),
    IonicStorageModule.forRoot(),
    HttpModule,
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    FeedPage,
    PerfilPage,
    ChatsPage,
    TabsControllerPage,
    HomePage,
    LoginPage,
    CadastroUserPage,
    ChatPage,
    EditProjetoPage,
    MyProjetoPage,
    ProjetosPage,
    TarefasProjetoPage,
    DespesasPage,
    SubTarefasPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AngularFireAuth,
    AngularFireStorage,
    AngularFireDatabase,
    TarefasProjetoPage,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    Camera,
    File,
    UserProvider,
    ProjetoProvider,
    TarefaProvider,
    SubtarefaProvider,

  ]
})
export class AppModule {


}