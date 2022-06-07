import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {GlobalDataService} from 'src/app/services/global-data.service';
import {AuthService} from '../../services/api-service/auth.service';

@Injectable({providedIn: 'root'})
export class AuthGuardHelper implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService,
    private globalDataService: GlobalDataService,
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.currentUserValue) {
      if (this.authService.token) {
        return new Observable<any>(subscriber => {
          this.globalDataService.checkFormChange('auth guard').subscribe((allowChange) => {
            if (allowChange) {
              subscriber.next(allowChange);
              subscriber.complete();
            } else {
              history.go(1);
            }
          });
        });
      } else {
        this.authService.gotoLogin();
      }
    } else if (this.authService.token) {
      return this.checkLogin();
    } else {
      this.authService.gotoLogin();
    }
  }

  private checkLogin(): Observable<boolean> {
    return new Observable(subscriber => {
      this.authService.getUserInfo().subscribe((userSession) => {
        if (userSession) {
          subscriber.next(true);
        }
      }, () => {
        this.authService.gotoLogin();
        subscriber.next(false);
      }, () => {
        subscriber.complete();
      });
    });
  }
}
