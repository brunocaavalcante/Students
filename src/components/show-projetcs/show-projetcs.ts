import { Component, Input } from '@angular/core';

@Component({
  selector: 'show-projetcs',
  templateUrl: 'show-projetcs.html'
})
export class ShowProjetcsComponent {

  @Input() pj;

  constructor() {

  }

}
