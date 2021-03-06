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
import { AngularFireStorage, AngularFireStorageModule } from '@angular/fire/storage';
import { UserProvider } from '../providers/user/user';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { ProjetoProvider } from '../providers/projeto/projeto-provider';
import { TarefaProvider } from '../providers/tarefa/tarefa';
import { SubtarefaProvider } from '../providers/subtarefa/subtarefa';
import { FindChatsPage } from '../pages/Menssagens/find-chats/find-chats';
import { AngularFirestore } from '@angular/fire/firestore';
import { Camera } from '@ionic-native/camera';
import { MessagePage } from '../pages/Menssagens/message/message';
import { ChatsProvider } from '../providers/chats/chats';
import { MessageBoxComponent } from '../components/message-box/message-box';
import { ProgressBarComponent } from '../components/progress-bar/progress-bar';
import { NewGrupMessagePage } from '../pages/Menssagens/new-grup-message/new-grup-message';
import { ShowProjetcsComponent } from '../components/show-projetcs/show-projetcs';

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
    MyProjetoPage,
    EditProjetoPage,
    ProjetosPage,
    TarefasProjetoPage,
    DespesasPage,
    SubTarefasPage,
    FindChatsPage,
    MessagePage,
    MessageBoxComponent,
    ProgressBarComponent,
    NewGrupMessagePage,
    ShowProjetcsComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp,{tabsHideOnSubPages: true}),
    AngularFireModule.initializeApp(environment.firebase),
    IonicStorageModule.forRoot(),
    HttpModule,
    AngularFireStorageModule,
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
    EditProjetoPage,
    MyProjetoPage,
    ProjetosPage,
    TarefasProjetoPage,
    DespesasPage,
    SubTarefasPage,
    FindChatsPage,
    MessagePage,
    NewGrupMessagePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AngularFireAuth,
    AngularFireStorage,
    AngularFireStorageModule,
    AngularFireDatabase,
    AngularFirestore,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    UserProvider,
    ProjetoProvider,
    TarefaProvider,
    SubtarefaProvider,
    Camera,
    ChatsProvider

  ]
})
export class AppModule {


}