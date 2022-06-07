import { Component, Input, OnInit, Output, EventEmitter, AfterViewInit, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import {Location} from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { BaseSelectMaster } from 'src/app/models/base-select-master';
import { DepartmentApi } from 'src/app/services/api-service/department.api';
import { GlobalDataService } from 'src/app/services/global-data.service';
import { LoadingService } from 'src/app/share/service/loading.service';
import { ConfirmationModalService } from 'src/app/share/service/modal/confirmation-modal.service';

@Component({
  selector: 'app-share-department-list',
  templateUrl: './share-department-list.component.html',
  styleUrls: ['./share-department-list.component.scss']
})
export class ShareDepartmentListComponent extends BaseSelectMaster implements OnInit, AfterViewInit {
  currentObj: any;

  @Input() items = [];
  @Input() excludeItems = [];
  @Input() level: number = 0;
  @Input() options = {};
  @Input() allowUnlinkParent = false;
  @Input() allowSelect = false;
  @Input() showRoot: boolean = false;

  @Input() selected: any = [];

  @Output() eventEdit = new EventEmitter<any>(); // click icon edit
  @Output() eventRemove = new EventEmitter<any>(); // click icon remove
  @Output() eventShowUser = new EventEmitter<any>();  // click icon show users
  @Output() eventUnLinkParent = new EventEmitter<any>();  // click icon unlink to parent
  @Output() eventSelect = new EventEmitter<any>();

  totalRecords: number = 0;

  @ViewChildren('departmentOne') departmentOnes;

  constructor(
    private departmentApi: DepartmentApi,
    protected router: Router,
    protected loading: LoadingService,
    protected confirmPopup: ConfirmationModalService,
    protected translate: TranslateService,
    protected globalDataService: GlobalDataService,
    protected location: Location,
    protected ngbModal: NgbModal,
  ) {
    super(departmentApi, router, loading, confirmPopup, translate, globalDataService, ngbModal, false);
  }

  ngOnInit() {
    if(!this.items?.length && this.showRoot){
      this.loadData();    
    }
  }

  loadData(){
    this.loading.showAppLoading();
      this.departmentApi.getAll({'parent_id' :0}).subscribe(res => {
          this.loading.hideAppLoading();
          this.items = res.items;
          this.totalRecords = res.total;
      });
  }

  changeSelected(selected){
    this.selected = selected;
  }

  ngAfterViewInit(): void{
     
  }
  onClickEdit(item){
    this.eventEdit.emit(item);
  }
  onClickRemove(item){
   this.eventRemove.emit(item);
  }
  onClickShowUser(item){
   this.eventShowUser.emit(item);
  }
  onClickUnlinkParent(item){
   this.eventUnLinkParent.emit(item);
  }
  onSelect(item){
   this.eventSelect.emit(item);
  }

}
