import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { TableHeaderModel } from '../../../models/table-header.model';
import { LoadingService } from '../../service/loading.service';
import { HandleError, HandleErrorModel } from '../../../models/handle-error.model';
import { PersistStateScreen } from '../../../configs/persist-state-screen';
import {PersistStateApi} from "../../../services/api-service/persist-state-api.service";

@Component({
  selector: 'app-column-setting',
  templateUrl: './column-setting.component.html',
  styleUrls: ['./column-setting.component.scss']
})
export class ColumnSettingComponent implements OnChanges {
  @ViewChild('modalContent') modalContent;
  @Input() headerColumns: Array<TableHeaderModel> = [];
  @Input() visibleColumns: Array<TableHeaderModel>;
  @Input() screenId: PersistStateScreen;
  @Output() headersChange = new EventEmitter<string | null>();

  columns: Array<{ name: string, column: string, isShow: boolean }> = [];
  popup: NgbModalRef;

  constructor(
    private ngbModal: NgbModal,
    private loading: LoadingService,
    private persistStateApi: PersistStateApi
  ) {
  }

  openPopup(): void {
    this.popup = this.ngbModal.open(this.modalContent);
    this.onLoad();
  }

  closePopup(): void {
    this.popup.close();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.headerColumns) {
    }
  }

  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
  }

  onApply(): void {
    const visibleColumns = this.columns.filter(col => col.isShow).map(v => v.column);
    this.headersChange.emit(visibleColumns.join());

    // call api to save setting
    this.loading.showAppLoading();
    this.persistStateApi.saveVisibleOrder(this.screenId, visibleColumns.join()).subscribe(() => {
      this.loading.hideAppLoading();
      this.closePopup();
    }, (er: HandleErrorModel) => {
      this.loading.hideAppLoading();
      const handleError = new HandleError(er);
      if (!handleError.errorCodes.length) {return; }
      // this.confirmPopup.notify('', handleError.getErrorCodeStr(this.translate));
    });
  }

  onReset(): void {
    this.onLoad(true);
    this.onApply();
  }

  onLoad(isReset = false): void {
    const mapCols = (col: TableHeaderModel, isShow: boolean) => {
      return { name: col.name, column: col.column, isShow };
    };

    if (isReset) {
      this.columns = this.headerColumns.map(header => mapCols(header, true));
    } else {
      const showCols = this.visibleColumns.map(col => mapCols(col, true));
      const hideCols = this.headerColumns.filter(header =>
        this.visibleColumns.every(vCol => vCol.column !== header.column))
        .map(col => mapCols(col, false));

      this.columns = showCols.concat(hideCols);
    }
  }
}
