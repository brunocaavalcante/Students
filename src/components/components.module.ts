import { NgModule } from '@angular/core';
import { MessageBoxComponent } from './message-box/message-box';
import { ProgressBarComponent } from './progress-bar/progress-bar';
import { ShowProjetcsComponent } from './show-projetcs/show-projetcs';
@NgModule({
	declarations: [MessageBoxComponent,
    ProgressBarComponent,
    ShowProjetcsComponent],
	imports: [],
	exports: [MessageBoxComponent,
    ProgressBarComponent,
    ShowProjetcsComponent]
})
export class ComponentsModule {}
