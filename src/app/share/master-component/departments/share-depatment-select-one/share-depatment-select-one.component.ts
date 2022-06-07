import { Component, Input, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import {Location} from '@angular/common';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { BaseListReadonly } from 'src/app/models/base-list-readonly';
import { DepartmentApi } from 'src/app/services/api-service/department.api';
import { GlobalDataService } from 'src/app/services/global-data.service';
import { LoadingService } from 'src/app/share/service/loading.service';
import { ConfirmationModalService } from 'src/app/share/service/modal/confirmation-modal.service';
import { BaseDetailPopup } from 'src/app/models/base-detail-popup';

@Component({
  selector: 'app-share-depatment-select-one',
  templateUrl: './share-depatment-select-one.component.html',
  styleUrls: ['./share-depatment-select-one.component.scss']
})
export class ShareDepatmentSelectOneComponent extends BaseDetailPopup implements OnInit {

  @Input() itemSelected: any = {};
  @Output() eventSelect = new EventEmitter<any>();

  @ViewChild('modalContent') modalContent;

  currentObj: any;
  popup: NgbModalRef;

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
    super(departmentApi, router, loading, confirmPopup, translate, globalDataService, ngbModal);
  }

  ngOnInit() {

  }

  openPop(): void {
    this.popup = this.ngbModal.open(this.modalContent, {size: '', scrollable: false, centered: false});
  }

  onSelect($event): void{
    if($event.value == 1){
      this.itemSelected = $event.item;
    }else{
      this.itemSelected = null;
    }
    this.eventSelect.emit(this.itemSelected);
  }

  clearData(): void{
    this.itemSelected = null;
    this.eventSelect.emit(this.itemSelected);
  }

  closePopup(){
    this.popup.close();
  }

}
