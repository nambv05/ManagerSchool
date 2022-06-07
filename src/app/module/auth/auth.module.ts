import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginComponent} from './login/login.component';
import {ShareModule} from '../../share/share.module';
import { ChangePasswordComponent } from './change-password/change-password.component';

@NgModule({
  declarations: [
    LoginComponent,
    ChangePasswordComponent,
  ],
  imports: [
    CommonModule,
    ShareModule,
  ]
})
export class AuthModule {
}
