import {Component, OnInit} from '@angular/core';
import {BaseDetail} from '../../../models/base-detail';
import {FormControl, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {LoadingService} from '../../service/loading.service';
import {Location} from '@angular/common';
import {LeaveRequestApiService} from '../../../services/api-service/leave_request.api.service';
import {ConfirmationModalService} from '../../service/modal/confirmation-modal.service';
import {TranslateService} from '@ngx-translate/core';
import {GlobalDataService} from '../../../services/global-data.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';


@Component({
  selector: 'app-leave-request-add',
  templateUrl: './leave-request-add.component.html',
  styleUrls: ['./leave-request-add.component.scss']
})
export class LeaveRequestAddComponent extends BaseDetail implements OnInit {
  currentObj = 'LEAVE_REQUEST';
  format: 'DD-MM-YYYY HH:mm';
  showFOrmAdd = false;
  employeeApproval: any = [];
  employeeReplace: any = [];

  dateTime = new FormControl();

  constructor(
    protected router: Router,
    protected loading: LoadingService,
    protected leaveRequestApi: LeaveRequestApiService,
    protected confirmPopup: ConfirmationModalService,
    protected translate: TranslateService,
    protected globalDataService: GlobalDataService,
    protected location: Location,
    protected activatedRoute: ActivatedRoute,
    protected ngbModal: NgbModal
  ) {
    super(leaveRequestApi, router, loading, confirmPopup, translate, globalDataService, activatedRoute, location);
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
      this.getDetail(this.id);
    });
  }

  ngOnInit(): void {
    if (!this.id)
      this.getPeopleApproval(this.form.get('leave_request_type').value);
  }

  buildForm(val?): any {
    const form = super.buildForm(val);
    form.addControl('id', new FormControl(val ? val.id : '', []));
    form.addControl('leave_request_type', new FormControl(val ? val.leave_request_type : 1, [Validators.required]));
    form.addControl('type', new FormControl(val ? val.type : 1, []));
    form.addControl('reason_id', new FormControl(val ? val.reason_id : 1, [Validators.required]));
    form.addControl('employees_replace', new FormControl(val ? val.employees_replace : [], [Validators.required]));
    form.addControl('reason', new FormControl(val ? val.reason : '', [Validators.required, Validators.maxLength(255)]));
    form.addControl('start_time', new FormControl(val ? val.start_time : '08:00', [Validators.required]));
    form.addControl('end_time', new FormControl(val ? val.end_time : '17:15', [Validators.required]));
    form.addControl('date_request', new FormControl(val ? val.date_request : '', [Validators.required]));
    form.addControl('paid_leave', new FormControl(val ? val.paid_leave : 1));

    form.get('leave_request_type').valueChanges.subscribe(value => {
      this.getPeopleApproval(value);

      form.get('start_time').setValue('08:00');
      form.get('end_time').setValue('17:15');

      if (value == 5 || value == 6 || value == 7) {
        form.get('employees_replace').clearValidators();
        form.get('employees_replace').updateValueAndValidity();
      }
    });


    if (val) {
      const arr = [];
      this.getPeopleApproval(val?.leave_request_type);

      val.leave_request_backup.map(value => {
        this.employeeReplace.push(value?.employee);
        arr.push(value?.employee.id);
      });

      if (val.leave_request_type == 5 || val.leave_request_type == 6 || val.leave_request_type == 7) {
        form.get('employees_replace').clearValidators();
        form.get('employees_replace').updateValueAndValidity();
      }

      form.get('employees_replace').setValue(arr);
    }

    this.showFOrmAdd = true;
    this.globalDataService.addForm(form);
    return form;
  }

  btnBack(): void {
    this.location.back();
  }

  getPeopleApproval(id): any {
    this.leaveRequestApi.getPeopleApproval(id).subscribe((val) => {
      this.employeeApproval = val;
    });
  }

  chooseMultipleValue(items): any {
    const arr = []
    items.map(val => {
      arr.push(val.id);
    });
    this.form.get('employees_replace').setValue(arr);
  }

  beginSave(): any {
    if (this.form.get('leave_request_type').value == 4) {
      this.form.get('start_time').setValue('');
      this.form.get('end_time').setValue('');
    }
    return true;
  }
}
