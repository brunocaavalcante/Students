import { Component, Input } from '@angular/core';


@Component({
  selector: 'message-box',
  templateUrl: 'message-box.html'
})
export class MessageBoxComponent {

  @Input() message;
  @Input() isTrue: boolean;

  constructor() {

  }

}
