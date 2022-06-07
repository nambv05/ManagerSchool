import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { InputFormat } from 'src/app/configs/input-format';
import { BaseList } from 'src/app/models/base-list';
import { ExamDataModel } from 'src/app/models/exam-data.model';
import { HandleError, HandleErrorModel } from 'src/app/models/handle-error.model';
import { TableHeader, TableHeaderModel } from 'src/app/models/table-header.model';
import { LoadingService } from 'src/app/share/service/loading.service';
import {EmployeeApi} from "src/app/services/api-service/emplyee-list.api";
import { ConfirmationModalService } from 'src/app/share/service/modal/confirmation-modal.service';
import {EmployeeModel} from "src/app/models/employee.model";
import {Location} from '@angular/common';
import {BaseDetail} from "src/app/models/base-detail";
import {BaseSelectMaster} from "src/app/models/base-select-master";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {GlobalDataService} from "src/app/services/global-data.service";
import { SortableDirective } from '../../directives/sortable.directive';
import {MasterSelectSearch} from "../../../configs/master-select-search";
import {FormControl, Validators} from "@angular/forms";
import {URL_LIST} from "../../../configs/url-list";

@Component({
  selector: 'app-employee-info',
  templateUrl: './employee-info.component.html',
  styleUrls: ['./employee-info.component.scss']
})
export class EmployeeInfoComponent extends  BaseSelectMaster implements OnInit {
  currentObj = 'EMPLOYEE_INFO';
  base_url = URL_LIST.EMPLOYEE_LIST;

  @ViewChildren(SortableDirective) sortHeaders: QueryList<SortableDirective>;
  activeId=1;
  masterSelectSearch = MasterSelectSearch;

  constructor(
    private employeeApi: EmployeeApi,
    protected router: Router,
    protected loading: LoadingService,
    protected confirmPopup: ConfirmationModalService,
    protected translate: TranslateService,
    protected globalDataService: GlobalDataService,
    protected location: Location,
    protected ngbModal: NgbModal,
  ) {
    super(employeeApi, router, loading, confirmPopup, translate, globalDataService, ngbModal);
  }
  avatarUrl = '';
  ngOnInit(): void {
    
  }
  getList(): void {
  }

  buildForm(val?): any {
    const form = super.buildForm(val);
    form._form.addControl('id', new FormControl({ value: val ? val.id : '', disabled: true }, []));
    form._form.addControl('name', new FormControl(val ? val.name : '', [Validators.maxLength(255)]));
    form._form.addControl('gender', new FormControl(val ? val.gender : 'Nam', []));
    form._form.addControl('department', new FormControl(val ? val.department : 'BU2', []));
    form._form.addControl('position', new FormControl(val ? val.position : 'Giám đốc', []));
    form._form.addControl('category', new FormControl(val ? val.category : 'ABC', []));
    form._form.addControl('group', new FormControl(val ? val.group : 'Giám đốc', []));
    form._form.addControl('status', new FormControl(val ? val.status : 'ABC', []));
    form._form.addControl('working_status', new FormControl(val ? val.working_status : 'Giám đốc', []));
    form._form.addControl('category', new FormControl(val ? val.category : 'ABC', []));
    return super.buildForm(val);
  }

}
