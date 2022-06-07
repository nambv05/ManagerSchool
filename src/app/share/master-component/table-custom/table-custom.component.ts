import {
  AfterViewChecked, AfterViewInit,
  Component,
  DoCheck,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChildren
} from '@angular/core';
import {SortableDirective, SortEvent} from '../../directives/sortable.directive';
import {FormControl} from '@angular/forms';
import {TableHeader, TableHeaderModel} from '../../../models/table-header.model';
import {BaseListReadonly} from '../../../models/base-list-readonly';
import { InputFormat } from 'src/app/configs/input-format';
import {BaseModel} from "../../../models/base.model";
import {EmployeeApi} from "../../../services/api-service/emplyee-list.api";
import {Router} from "@angular/router";
import {LoadingService} from "../../service/loading.service";
import {ConfirmationModalService} from "../../service/modal/confirmation-modal.service";
import {TranslateService} from "@ngx-translate/core";
import {GlobalDataService} from "../../../services/global-data.service";
import {Location} from "@angular/common";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {BaseApi} from "../../../services/api-service/base.api";

@Component({
  selector: 'app-table-custom',
  templateUrl: './table-custom.component.html',
  styleUrls: ['./table-custom.component.scss']
})
export class TableCustomComponent extends BaseModel implements OnChanges, DoCheck {
  isShow = false;
  @ViewChildren(SortableDirective) sortHeaders: QueryList<SortableDirective>;
  @Input() headers: TableHeaderModel[] = [];
  @Input() dataList: Array<unknown>;
  @Input() canDelete = false;
  @Input() canEdit = false;
  @Input() canView = false;
  @Input() selectOnlyOne = false;
  @Input() selectedValue: { key: string, value: string } = {key: 'code', value: ''};
  @Input() sortColumn = '';
  @Input() selectSearchMode = false;
  @Input() isSort = true;
  @Output() editClick = new EventEmitter();
  @Output() viewClick = new EventEmitter();
  @Output() deleteClick = new EventEmitter();
  @Output() actionRow = new EventEmitter();
  @Output() sort = new EventEmitter<SortEvent>();
  @Output() selectRow = new EventEmitter<Array<any>>();

  enableHeaders: TableHeaderModel[];
  data: Array<unknown>;
  inputFormat = InputFormat;

  constructor() {
    super();
  }

  ngDoCheck(): void {
    this.isShow = true;
    const splitSortRgx = this.sortColumn.split(/(\+|-)/);
    if (splitSortRgx.length === 3) {
      this.sortHeaders.forEach(header => {
        if (header.sortable === splitSortRgx[2]) {
          header.direction = splitSortRgx[1] === '+' ? 'asc' : 'desc';
        }
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const canAction = {canEdit: true, canView: true, canDelete: true};
    this.data = this.dataList.map(v => {
      return Object.assign({}, canAction, v, {checked: new FormControl(false)} );
    });
  }

  onSort(e: SortEvent): void {
    // resetting other headers
    this.sortHeaders.forEach(header => {
      if (header.sortable !== e.column) {
        header.direction = '';
      }
    });

    this.sort.emit(e);
  }

  onDetail(item,i): void {
    if (this.canEdit) {
      this.editClick.emit({item, i});
    }
  }
  onView(item, i): void {
    if (this.canView) {
      this.viewClick.emit({item, i});
    }
  }

  onDelete(item, i): void {
    if (this.canDelete) {
      this.deleteClick.emit({item, i});
    }
  }


  onActionRow(colname, item): void {
    this.actionRow.emit({ colname, item });
  }

  get isSelectedAll(): boolean {
    return this.data.length && this.data.every(it => it['checked'].value);
  }

  setSelectRow(item: object, value: boolean): void {
    if (this.selectOnlyOne) {
      this.data.map(v => {
        v['checked'].setValue(false);
      });
    }
    item['checked'].setValue(value);
    this.selectRow.emit(this.data.filter(v => v['checked'].value));
  }

  setSelectAll(val: boolean): void {
    if (this.selectOnlyOne) {
      return;
    }
    this.data.map(v => {
      v['checked'].setValue(val);
    });
    this.selectRow.emit(this.data.filter(v => v['checked'].value));
  }

  onClickRow(item: object): void {
    if (this.selectOnlyOne) {
      this.selectRow.emit([item]);
    }
  }
}
