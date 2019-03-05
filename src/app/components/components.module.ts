import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ListComponent } from './list/list.component';
import { ListHeaderComponent } from './list-header/list-header.component';
import { MyTestComponent } from './my-test/my-test.component';

@NgModule({
    declarations: [ListComponent, ListHeaderComponent, MyTestComponent],
    imports: [
      CommonModule,
      IonicModule,
    ],
    exports: [ListComponent, ListHeaderComponent, MyTestComponent],
  })
  export class ComponentsModule { }