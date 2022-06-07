import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { InputFormat } from 'src/app/configs/input-format';
import { MasterSelectSearch } from 'src/app/configs/master-select-search';
import { BaseSelectMaster } from 'src/app/models/base-select-master';
import { TableHeaderModel } from 'src/app/models/table-header.model';
import { DepartmentApi } from 'src/app/services/api-service/department.api';
import { GlobalDataService } from 'src/app/services/global-data.service';
import { LoadingService } from 'src/app/share/service/loading.service';
import { ConfirmationModalService } from 'src/app/share/service/modal/confirmation-modal.service';

@Component({
  selector: 'app-share-department-select',
  templateUrl: './share-department-select.component.html',
  styleUrls: ['./share-department-select.component.scss']
})
export class ShareDepartmentSelectComponent extends BaseSelectMaster implements OnInit {

  @Input() title = "Chọn bộ phận";
  @Input() items = [];

  @Output() onChange = new EventEmitter<any>(); // click icon edit

  currentObj: any;

  headers: TableHeaderModel[] = [
    {name: 'Name', column: 'name', type: InputFormat.SELECT_SEARCH, isFilter: true,
      selectSearchOption: {
        apiUrl: 'departments',
        selectColumn: 'name',colLabel:'name',colValue:'name'
      }
    },
    {name: 'Description', column: 'description', isFilter: true }
  ];

  constructor(
    protected departmentApi: DepartmentApi,
    protected router: Router,
    protected loading: LoadingService,
    protected confirmPopup: ConfirmationModalService,
    protected translate: TranslateService,
    protected globalDataService: GlobalDataService,
    protected ngbModal: NgbModal,
  ) {
    super(departmentApi, router, loading, confirmPopup, translate, globalDataService, ngbModal, false);
  }

  ngOnInit() {
    if(!this.items?.length){
      this.items.push({});
    }
    this.showForms();
  }

  buildForm(val?): any {
    const form = super.buildForm(val);
    form._form.addControl('id', new FormControl(val ? val.id : '', []));
    form._form.addControl('name', new FormControl(val ? val.name : '', []));
    form._form.addControl('description', new FormControl({ value: val ? val.description : '', disabled: true}, []));
    return form;
  }

  private showForms(items = null){
    if(items) this.items = items;
    this.formList = this.items.map(item => {
        return this.buildForm(item);
    });
  }

  emitDeleteOne(){
    this.changeData();
  }

  catchMasterPopupData(fg: FormGroup, editField: string, e: any){
    if(editField==='name'){
      fg.get('id').setValue(e? e.id:'',{emitEvent: false});
      fg.get('description').setValue(e? e.description:'',{emitEvent: false});
    }
    this.changeData();
  }

  changeData(){
    const items = this.formList.filter(v => !v._form.get('isDeleted').value).map(v => v._form.getRawValue());
    this.onChange.emit(items);
  }
}
