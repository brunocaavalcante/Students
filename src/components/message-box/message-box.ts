import { Component, Input } from '@angular/core';

@Component({
  selector: 'message-box',
  templateUrl: 'message-box.html',
  host: {
    '[style.justify-content]': '((isTrue) ? "flex-end" : "flex-start")',
    '[style.text-align]': '((isTrue) ? "right" : "left")'
  }
})
export class MessageBoxComponent {

  @Input() message;
  @Input() isTrue: boolean;

  constructor() {
    
  }
}
