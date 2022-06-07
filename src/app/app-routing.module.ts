import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './module/auth/login/login.component';
import {MainLayoutComponent} from './module/layout/main-layout/main-layout.component';
import {NotFoundComponent} from './module/layout/not-found/not-found.component';
import {LoginPageGuardHelper} from './helpers/authen/login-page-guard.helper';
import {AuthGuardHelper} from './helpers/authen/auth-guard.helper';

const routes: Routes = [
  {path: '', redirectTo: '/admin', pathMatch: 'full'},
  {
    path: 'login', component: LoginComponent,
    canActivate: [LoginPageGuardHelper]
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuardHelper],
    loadChildren: () => import('src/app/module/main/main.module').then(m => m.MainModule)
  },
  {path: 'not-found', component: NotFoundComponent},
  {path: '**', redirectTo: 'not-found'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
