import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Segment } from 'ionic-angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { ProjetoProvider } from '../../../providers/projeto/projeto-provider';
import { Observable } from 'rxjs';
import chartJs from 'chart.js';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-despesas',
  templateUrl: 'despesas.html',
})
export class DespesasPage {
  @ViewChild('barCanvas') barCanvas;
  @ViewChild(Segment) segment: Segment;

  barChart: any;
  newDespesaForm: FormGroup;
  projeto;
  list = [];
  items: Observable<any>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public afAuth: AngularFireAuth,
    public alertCtrl: AlertController,
    public pj: ProjetoProvider,
    public formbuilder: FormBuilder
  ) {
    this.projeto = this.navParams.get('projeto');
    this.getDespesas();
    this.newDespesaForm = this.formbuilder.group({
      descricao: [null, [Validators.required, Validators.minLength(10)]],
      titulo: [null],
      valor: [null],
      venc: [null, [Validators.required]],
      // id_projeto: this.projeto.id,
      // id_criador: this.afAuth.auth.currentUser.email,
      // pago: false,
    })
  }

  insertDespesa() {
    this.pj.insertDespesas(this.newDespesaForm.value);
    this.presentAlert("Despesa Cadastrada", "");
    this.ionViewDidLoad();
  }

  getDespesas() {
    this.items = this.pj.getDespesas(this.projeto.id);
  }

  getChart(context, chartType, data, options?) {
    return new chartJs(context, {
      data,
      options,
      type: chartType
    })
  }

  getBarChart() {
    const data = {
      labels: ['Vermelho', 'Azul', 'Amarelo', 'Verde', 'Roxo'],
      datasets: [{
        label: 'número de votos',
        data: [12, 23, 15, 90, 5],
        backgroundColor: [
          'rgb(255, 0, 0)',
          'rgb(20, 0, 255)',
          'rgb(255, 230, 0)',
          'rgb(0, 255, 10)',
          'rgb(60, 0, 70)'
        ],
        borderWidth: 1
      }]
    };

    const options = {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }

    return this.getChart(this.barCanvas.nativeElement, 'bar', data, options);
  }

  public presentAlert(title: string, subtitle: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: ['OK']
    });
    alert.present();
  }

  ionViewDidLoad() {
  }

  ngAfterViewInit() {
      this.segment.ngAfterContentInit();
      this.segment._inputUpdated();
      setTimeout(() => {
        this.barChart = this.getBarChart();
        // this.lineChart = this.getLineChart();
      }, 150)
    
  }



}
