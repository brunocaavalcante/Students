import { Component, Input } from '@angular/core';


@Component({
  selector: 'progress-bar',
  templateUrl: 'progress-bar.html'
})
export class ProgressBarComponent {

  text: string;
  @Input() progress: number;

  constructor() {
    this.text = 'Hello World';
  }

}
