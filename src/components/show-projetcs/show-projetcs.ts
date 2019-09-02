import { Component } from '@angular/core';

@Component({
  selector: 'show-projetcs',
  templateUrl: 'show-projetcs.html'
})
export class ShowProjetcsComponent {

  text: string;

  constructor() {
    console.log('Hello ShowProjetcsComponent Component');
    this.text = 'Hello World';
  }

}
