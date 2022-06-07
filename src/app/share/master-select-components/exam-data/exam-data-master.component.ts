import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { TableHeaderModel } from '../../../models/table-header.model';
import { InputFormat, MaxValue } from '../../../configs/input-format';
import { PersistStateScreen } from '../../../configs/persist-state-screen';
import { ConfirmationModalService } from '../../service/modal/confirmation-modal.service';
import { TranslateService } from '@ngx-translate/core';
import { GlobalDataService } from '../../../services/global-data.service';
import { LoadingService } from '../../service/loading.service';
import { ExamDataApi } from '../../../services/api-service/exam-data.api';
import { HandleError, HandleErrorModel } from '../../../models/handle-error.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from '../../utils/custom-validators';
import { QuickAccessForm } from '../../utils/quick-access-form';
import { BaseSelectMaster } from '../../../models/base-select-master';
import { RegexConfig } from '../../../configs/regex-config';
import { Observable } from 'rxjs';
import { SortableDirective } from '../../directives/sortable.directive';
import {ExamDataModel} from "../../../models/exam-data.model";
import {Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-exam-data-master',
  templateUrl: './exam-data-master.component.html',
  styleUrls: ['./exam-data-master.component.scss']
})
export class ExamDataMasterComponent extends BaseSelectMaster implements OnInit {

  currentObj = 'EXAM_DATA_LIST';

  headers: TableHeaderModel[] = [
    { name: 'EXAMDATA.ID', column: 'id' },
    { name: 'EXAMDATA.NAME', column: 'name', isFilter: true },
    { name: 'EXAMDATA.NUMBER', column: 'number', type: InputFormat.NUMBER, isFilter: true },
    { name: 'EXAMDATA.DATE', column: 'date', type: InputFormat.DATE, isFilter: true },
    { name: 'EXAMDATA.STATUS', column: 'status', type: InputFormat.BOOLEAN, isFilter: true },
    { name: 'Nhân sự', column: 'children', type: InputFormat.BUTTONCIRCLE, classColumn: 'text-center' },
    { name: 'Thao tác', column: 'action', type: InputFormat.BUTTON, classColumn: 'text-center' },
  ];
  dataList: Array<ExamDataModel> = [];

  constructor(
    private examDataAPI: ExamDataApi,
    protected router: Router,
    protected loading: LoadingService,
    protected confirmPopup: ConfirmationModalService,
    protected translate: TranslateService,
    protected globalDataService: GlobalDataService,
    protected ngbModal: NgbModal,
    ) {
    super(examDataAPI, router, loading, confirmPopup, translate, globalDataService, ngbModal);
  }

  ngOnInit() {
    // uncomment to get datalive
    // this.getList();

    // remove below lines
    this.dataList.push({ id: 1, name: "name 1", number: 10, date: new Date(), status: true, action: "Xét quyền", children: 10 });
    this.dataList.push({ id: 2, name: "name 2", number: 12, date: new Date(), status: true, action: "Xét quyền", children: 15 });
    this.dataList.push({ id: 3, name: "name 3", number: 14, date: new Date(), status: false, action: "Xét quyền", children: 20 });
    this.dataList.push({ id: 4, name: "name 4", number: 15, date: new Date(), status: true, action: "Xét quyền", children: 13 });
    this.dataList.push({ id: 5, name: "name 5", number: 11, date: new Date(), status: true, action: "Xét quyền", children: 10 });
    this.totalRecords = 100;
  }

  onDetail(e: ExamDataModel): void {
    this.router.navigate(['exam-data/detail/' + e.id]);
  }

  onActionRow($event: { colname: string, item: ExamDataModel }): void {
    if ($event.colname == "children") {
      console.log("navigate to page children");
    }
  }
}
