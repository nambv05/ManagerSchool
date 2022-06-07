import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { CustomValidators } from '../../../share/utils/custom-validators';
import { UserSession } from '../../../models/user-session.model';
import { Router } from '@angular/router';
import { LoadingService } from '../../../share/service/loading.service';
import { ConfirmationModalService } from '../../../share/service/modal/confirmation-modal.service';
import { AuthService } from '../../../services/api-service/auth.service';
import { HandleError, HandleErrorModel } from '../../../models/handle-error.model';
import { TranslateService } from '@ngx-translate/core';
import { QuickAccessForm } from '../../../share/utils/quick-access-form';
import { UserSessionInterface, UserSubjectInterface } from 'src/app/interfaces/user-session.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    email: new FormControl('admin@ominext.com', CustomValidators.required()),
    password: new FormControl('123456', CustomValidators.requiredPassWord()),
  });

  showPassword = false;
  submitted = false;
  errorLogin: any;

  constructor(
    private router: Router,
    private loading: LoadingService,
    private confirmPopup: ConfirmationModalService,
    private authService: AuthService,
    private translate: TranslateService,
  ) {
  }

  ngOnInit(): void {
  }

  login(): void {
    this.submitted = true;
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) {
      return;
    }
    this.loading.showAppLoading();
    this.loginForm.get('email').setValue(this.loginForm.value.email.trim());
    const params = this.loginForm.value;
    this.authService.login(params).subscribe((val: UserSubjectInterface) => {
      this.router.navigateByUrl('/admin', { replaceUrl: true }).then();
      this.loading.hideAppLoading();
    }, (er: HandleErrorModel) => {
      this.loading.hideAppLoading();
      const handleError = new HandleError(er);
      this.errorLogin = handleError.getErrorCodeStr(this.translate);
    });
  }

  onTrim() {
    if (this.loginForm.get('email').value && this.loginForm.get('email').dirty)
      this.loginForm.get('email').setValue(this.loginForm.get('email').value.trim())
  }

  // convenience getter for easy access to form fields
  form(control: string): AbstractControl {
    return this.loginForm.get(control);
  }

  isShowErrorControl(controlName: string): boolean {
    return QuickAccessForm.isShowErrorControl(this.loginForm, controlName);
  }

  getErrorControlMsg(errors: Array<string>, controlName: string): string {
    return QuickAccessForm.getErrorControlMsg(this.loginForm, controlName, errors, 'LOGIN_PAGE.ERRORS', this.translate);
  }
}
