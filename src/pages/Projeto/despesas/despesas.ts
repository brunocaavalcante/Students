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
  @ViewChild('pieCanvas') pieCanvas;
  @ViewChild(Segment) segment: Segment;

  barChart: any;
  pieChart: any;
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
      prioridade: [null, [Validators.required]]
    })
  }

  deleteDespesa(item) {
    this.pj.presentShowConfirm(item, "Deseja deletar a despesa?", "", "despesas");
  }

  finalizaDesp(item) {
    item.pago = true;
    this.pj.updateDespesa(item);
  }

  insertDespesa() {
    var item = this.newDespesaForm.value;
    item.id_projeto = this.projeto.id;
    item.id_criador = this.afAuth.auth.currentUser.email;
    item.pago = false;
    this.pj.insertDespesas(this.newDespesaForm.value);
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

  getPieChart(){
    const data = {
      labels: ['Orçamento', 'Gastos'],
      datasets: [{
        data: [300-75, 75],
        backgroundColor: ['rgb(36, 0, 255)','rgb(200, 6, 0)']
      }]
    }

    return this.getChart(this.pieCanvas.nativeElement, 'pie', data);
  }

  ionViewDidLoad() {
    this.segment.value = 'geral';
  }

  ngAfterViewInit() {
    this.segment.ngAfterContentInit();
    this.segment._inputUpdated();
    setTimeout(() => {
      this.barChart = this.getBarChart();
    }, 150)
  }

  segmentChanged(ev: any) {
    if (ev._value == 'geral') {
      setTimeout(() => {
        this.barChart = this.getBarChart();
        this.pieChart = this.getPieChart();
      }, 150);
    }
  }

}
