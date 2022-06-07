import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from '../../services/api-service/auth.service';

@Injectable({providedIn: 'root'})
export class LoginPageGuardHelper implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.authService.token) {
      return true;
    } else {
      this.router.navigateByUrl('', {replaceUrl: true}).then();
      return false;
    }
  }
}
