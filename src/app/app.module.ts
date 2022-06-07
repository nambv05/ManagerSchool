import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { JwtInterceptorHelper } from './helpers/http/jwt-interceptor.helper';
import { ErrorInterceptorHelper } from './helpers/http/error-interceptor.helper';
import { LayoutModule } from './module/layout/layout.module';
import { AuthModule } from './module/auth/auth.module';

export function HttpLoaderFactory(httpClient: HttpClient): any {
  return new TranslateHttpLoader(httpClient);
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    LayoutModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptorHelper, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorHelper, multi: true }
  ]
})
export class AppModule {
}
