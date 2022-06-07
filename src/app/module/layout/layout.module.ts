import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MainLayoutComponent} from './main-layout/main-layout.component';
import {NotFoundComponent} from './not-found/not-found.component';
import {DefaultLayoutComponent} from './default-layout/default-layout.component';
import {ShareModule} from '../../share/share.module';
import {MatMenuModule} from '@angular/material/menu';

const layouts = [
  MainLayoutComponent,
  NotFoundComponent,
  DefaultLayoutComponent
];

@NgModule({
  declarations: [layouts],
  exports: [layouts],
  imports: [
    CommonModule,
    ShareModule,
    MatMenuModule
  ]
})
export class LayoutModule {
}
