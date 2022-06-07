import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';
import {GlobalDataService} from 'src/app/services/global-data.service';
import {LoadingService} from 'src/app/share/service/loading.service';
import {ConfirmationModalService} from 'src/app/share/service/modal/confirmation-modal.service';
import {Location} from '@angular/common';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {TableHeaderModel} from "../../../models/table-header.model";
import {InputFormat} from "../../../configs/input-format";
import {MasterSelectSearch} from "../../../configs/master-select-search";
import {BaseSelectMaster} from "../../../models/base-select-master";
import {EmployeeGroupApi} from "../../../services/api-service/employee-group.api";
import {EmployeeApi} from "../../../services/api-service/emplyee-list.api";

@Component({
  selector: 'app-add-employee-to-group',
  templateUrl: './add-employee-to-group.component.html',
  styleUrls: ['./add-employee-to-group.component.scss']
})
export class AddEmployeeToGroupComponent extends BaseSelectMaster implements OnInit {
  currentObj = 'add-employee-to-group';

  headers: TableHeaderModel[] = [
    // {name: 'EMPLOYEE.ID', column: 'id', isHide: true},
    {name: 'EMPLOYEES.FIELDS.FULL_NAME', column: 'full_name', isFilter: true, type: InputFormat.SELECT_SEARCH, selectSearchOption: {
        apiUrl: 'employees',
        masterSearchComponents: MasterSelectSearch.EMPLOYEE_GROUP, selectColumn: 'full_name',colLabel:'full_name',colValue:'name'
      }},
    {name: 'EMPLOYEES.FIELDS.EMAIL', column: 'email', isFilter: true},
    {name: 'EMPLOYEES.FIELDS.ID', column: 'employee_code', isFilter: true},
    {name: 'EMPLOYEES.FIELDS.BIRTHDAY', column: 'birth_day', isFilter: true},
  ];
  isShowForm: boolean = false;
  formGroupAdd: FormGroup;
  @Output() closeForm = new EventEmitter<any>();
  @Input() groupID: number;

  constructor(
    protected location: Location,
    protected router: Router,
    protected loading: LoadingService,
    protected confirmPopup: ConfirmationModalService,
    protected employeeGroupApi: EmployeeGroupApi,
    protected translate: TranslateService,
    protected globalDataService: GlobalDataService,
    protected ngbModal: NgbModal
  ) {
    super(employeeGroupApi, router, loading, confirmPopup, translate, globalDataService, ngbModal);
  }

  ngOnInit(): void {
    this.showFormEdit();
  }

  getList(): void { }

  buildForm(val?): any {
    const form = super.buildForm(val);
    // console.log(val);
    form._form.addControl('id', new FormControl(val ? val.id : '', []));
    form._form.addControl('full_name', new FormControl( val ? val.full_name : '', [Validators.maxLength(255)]));
    form._form.addControl('employee_code', new FormControl({value: val ? val.employee_code : '', disabled: true}, []));
    form._form.addControl('email', new FormControl({value: val ? val.email : '', disabled: true}, []));
    form._form.addControl('birth_day', new FormControl({value: val ? val.birth_day : '', disabled: true}, []));

    if (!this.selectSearchMode) {
      this.globalDataService.addForm(form._form);
    }
    return form;
  }

  catchMasterPopupData(fg: FormGroup, editField: string, e: any): void {
    if(editField==='full_name'){
      fg.get('id').setValue(e? e.id:'',{emitEvent: false});
      fg.get('employee_code').setValue(e? e.employee_code:'',{emitEvent: false});
      fg.get('email').setValue(e? e.email:'',{emitEvent: false});
      fg.get('birth_day').setValue(e? e.birth_day:'',{emitEvent: false})
    }
  }

  showFormEdit() {
    if (this.groupID) {
      this.loading.showAppLoading();
      this.employeeGroupApi.getEmployees(this.groupID).subscribe(res => {
        this.loading.hideAppLoading();
        res.map(val => {
          this.formList = val.employees.map(v=>{
            return this.buildForm(v);
          });
          this.isShowForm = true;
        });
      }, error => {
        this.loading.hideAppLoading();
        this.onCloseForm();
      });
    } else {

    }
  }

  onCloseForm(): void {
    this.isShowForm = false;
    this.closeForm.emit();
  }


  saveAll(){
    const ids = this.formList.filter(v =>  v._form.get('isDeleted').value == false
    ).map(v => v._form.get('id').value
    );
    if(ids.length==0||!ids ){
      return;
    }

    this.loading.showAppLoading();
    this.employeeGroupApi.saveEmployees(this.groupID,ids).subscribe(res => {
      this.loading.hideAppLoading();
      this.confirmPopup.success(this.translate.instant('COMMON.SAVE_SUCCESSFUL'));
    }, err => {
      this.loading.hideAppLoading();
      console.log(err);
    });
  }
}
