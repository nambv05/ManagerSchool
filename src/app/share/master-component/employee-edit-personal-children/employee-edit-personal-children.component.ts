import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {Location} from "@angular/common";
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormControl, Validators} from "@angular/forms";
import {LoadingService} from "../../service/loading.service";
import {ConfirmationModalService} from "../../service/modal/confirmation-modal.service";
import {EmployeeApi} from "../../../services/api-service/emplyee-list.api";
import {GlobalDataService} from "../../../services/global-data.service";
import {BaseSelectMaster} from "../../../models/base-select-master";

@Component({
  selector: 'app-employee-edit-personal-children',
  templateUrl: './employee-edit-personal-children.component.html',
  styleUrls: ['./employee-edit-personal-children.component.scss']
})
export class EmployeeEditPersonalChildrenComponent extends BaseSelectMaster implements OnInit {
  currentObj = 'EMPLOYEES';
  @Input() children: any;
  @Input() allowChange = true;
  placeholder = "dd-mm-yyyy";
  format = "DD-MM-YYYY";

  constructor(
    protected location: Location,
    protected router: Router,
    protected loading: LoadingService,
    protected confirmPopup: ConfirmationModalService,
    protected employeeApi: EmployeeApi,
    protected translate: TranslateService,
    protected globalDataService: GlobalDataService,
    protected ngbModal: NgbModal,
  ) {
    super(employeeApi, router, loading, confirmPopup, translate, globalDataService, ngbModal, false);
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.formList = this.children?.map(item => {
      return this.buildForm(item);
    });
  }

  buildForm(val?): any {
    const form = super.buildForm(val);

    form._form.addControl('id', new FormControl({value: val ? val.id : '', disabled:true}));
    form._form.addControl('name', new FormControl(val ? val.name : '', [Validators.required]));
    form._form.addControl('birthday', new FormControl(val ? val.birthday : '', [Validators.required]));
    form._form.addControl('gender', new FormControl(val ? val.gender : ''));
    form._form.addControl('address', new FormControl(val ? val.address : ''));

    return form;
  }

  addNew(){
    this.formList.push(this.buildForm());
  }
  removeItem(index){
    this.formList.splice(index, 1);
  }

}
