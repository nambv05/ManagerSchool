import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
import { AuthService } from '../../services/api-service/auth.service';
import { environment } from '../../../environments/environment';
import { ResponseApiInterface } from 'src/app/interfaces/response-api.interface';
import { map } from 'rxjs/operators';

@Injectable()
export class JwtInterceptorHelper implements HttpInterceptor {
  constructor(
    private authService: AuthService,
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.authService.currentUserValue && this.authService.currentUserValue.token !== this.authService.token) {
      location.reload();
      return EMPTY;
    }
    // add auth header with jwt if user is logged in and request is to the api url
    const isApiUrl = request.url.startsWith(environment.apiUrl);
    if (this.authService.token && isApiUrl) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.authService.token}`
        }
      });
    }

    return next.handle(request).pipe(map(event => {
      if (event instanceof HttpResponse) {
        const body: ResponseApiInterface = event.body;
        return event.clone({ body: body.data });
      }
    }));
  }
}
