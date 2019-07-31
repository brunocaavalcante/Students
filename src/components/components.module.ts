import { NgModule } from '@angular/core';
import { MessageBoxComponent } from './message-box/message-box';
import { ProgressBarComponent } from './progress-bar/progress-bar';
@NgModule({
	declarations: [MessageBoxComponent,
    ProgressBarComponent],
	imports: [],
	exports: [MessageBoxComponent,
    ProgressBarComponent]
})
export class ComponentsModule {}
