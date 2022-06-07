import { Injectable, NgZone } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Router } from '@angular/router';
import { AuthService } from '../../services/api-service/auth.service';
import { LoadingService } from '../../share/service/loading.service';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationModalService } from '../../share/service/modal/confirmation-modal.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalDataService } from '../../services/global-data.service';
import { NavMenuList } from "../../configs/menu-list";

@Injectable()
export class ErrorInterceptorHelper implements HttpInterceptor {
  constructor(
    private router: Router,
    private zone: NgZone,
    private authService: AuthService,
    private loading: LoadingService,
    private translate: TranslateService,
    private confirmPopup: ConfirmationModalService,
    private globalDataService: GlobalDataService,
    private modalService: NgbModal,
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError(err => {
        const role = JSON.parse(localStorage.getItem('role'));
        this.loading.hideAppLoading();
        if (err.status === 403) {
          this.zone.run(() => {
            this.globalDataService.clearForm();
            this.authService.clearToken();
            this.authService.gotoLogin();
          });
        } else if (err.status == 401 || err.status == 423) {
          // 423: account unactive and deleted (lock)
          this.authService.clearToken();
          this.confirmPopup.notify('', 'error.' + err.error.message, 'ok', () => {
            NavMenuList.filter(menu => {
              return menu.isOpen = false;
            });
            this.modalService.dismissAll();
            this.globalDataService.clearForm();
            this.authService.gotoLogin();
          });
        } else if (err.status == 0) {
          this.modalService.dismissAll();
          this.confirmPopup.notify('', 'error.ER0029');
        }
        return throwError(err.error);
      })
    );
  }
}
