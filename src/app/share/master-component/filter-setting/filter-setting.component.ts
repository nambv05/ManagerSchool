import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TableHeader, TableHeaderModel } from '../../../models/table-header.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { InputFormat, TypeFilter } from '../../../configs/input-format';
import { FilterSetting } from '../../../configs/filter-setting';
import * as moment from 'moment';
import { Select2Option, Select2OptionModel } from '../../../models/select2-option.model';
import { PersistStateScreen } from '../../../configs/persist-state-screen';
import { LoadingService } from '../../service/loading.service';
import { DateFormatDash } from 'src/app/configs/date-time-config';

@Component({
  selector: 'app-filter-setting',
  templateUrl: './filter-setting.component.html',
  styleUrls: ['./filter-setting.component.scss']
})
export class FilterSettingComponent implements OnInit, OnChanges {
  @ViewChild('modalContent') modalContent;
  @Input() columns: Array<TableHeaderModel> = [];
  @Input() criteria: Array<Array<string>> = [];
  @Input() screenId: PersistStateScreen;
  @Output() filtersChange = new EventEmitter<Array<Array<string>>>();

  filterForm: Array<{
    conditions: Array<{ name: string, value: string }>,
    select2Option?: Select2OptionModel,
    type: TypeFilter,
    form: FormGroup
  }> = [];
  filterColumns: Array<TableHeader>;

  popup: NgbModalRef;

  constructor(
    private ngbModal: NgbModal,
    private loading: LoadingService,
  ) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.columns?.currentValue) {
      this.filterColumns = this.columns.map(v =>
        new TableHeader(Object.assign({}, v, { filterType: this.getTypeFilter(v.type) })));
    }
  }

  openPopup(): void {
    this.filterForm = this.criteria.map(v => this.buildFilterForm({
      compareField: v[0],
      condition: v[1],
      compareValue: v[2]
    }));
    this.popup = this.ngbModal.open(this.modalContent, { size: 'lg', scrollable: true });
  }

  closePopup(): void {
    this.popup.close();
  }

  onDelete(index): void {
    this.filterForm.splice(index, 1);
  }

  onAdd(): void {
    this.filterForm.push(this.buildFilterForm());
  }

  onReset(): void {
    this.filterForm = [];
    this.onApply();
  }

  onApply(): void {
    // emit data
    const emitVal = this.filterForm.filter(v =>
      // clear all no-typing filter
      String(v.form.get('compareField').value).trim()
      && String(v.form.get('compareValue').value).trim()
    ).map(v =>
      // merge condition to array
      [
        v.form.value.compareField,
        v.form.value.condition,
        typeof v.form.value.compareValue === 'string' ? String(v.form.value.compareValue).trim() : v.form.value.compareValue
      ]);

    this.filtersChange.emit(emitVal);
    this.closePopup();
  }

  private buildFilterForm(filterVal?: { compareField: string, condition: string, compareValue: string })
    : { conditions: Array<{ name: string, value: string }>, type: TypeFilter, form: FormGroup } {
    const filterForm = {
      conditions: [],
      select2Option: new Select2Option(),
      type: this.getTypeFilter(),
      form: new FormGroup({
        compareField: new FormControl(''),
        condition: new FormControl(''),
        compareValue: new FormControl('')
      })
    };
    filterForm.form.get('compareField').valueChanges.subscribe((val: string) => {
      const filterColumn = this.filterColumns.find(v => v.column === val);
      if (filterColumn) {
        // get condition of type
        filterForm.type = this.getTypeFilter(filterColumn.type);
        filterForm.select2Option = new Select2Option(filterColumn.select2Option);
        filterForm.conditions = FilterSetting[filterForm.type];
        filterForm.form.get('condition').setValue(filterForm.conditions[0]?.value);
        // set default value
        const defaultVal = this.defaultFilterValue(filterForm.type, filterColumn.select2Option);
        filterForm.form.get('compareValue').setValue(defaultVal);
      }
    });
    if (filterVal) {
      filterForm.form.patchValue(filterVal);
    }
    return filterForm;
  }

  private defaultFilterValue(type: TypeFilter, options?: Select2OptionModel): string | number | boolean {
    switch (type) {
      case 'boolean':
        return true;
      case 'date':
        return moment().format(DateFormatDash);
      case 'number':
        return '';
      case 'select':
        return options?.bindValue ? options?.options[0][options.bindValue] : options?.options[0];
      default:
        return '';
    }
  }

  private getTypeFilter(type?: InputFormat): TypeFilter {
    switch (type) {
      case InputFormat.DATE:
        return 'date';
      case InputFormat.BOOLEAN:
        return 'boolean';
      case InputFormat.NUMBER:
      case InputFormat.FLOAT:
        return 'number';
      case InputFormat.SELECT2:
        return 'select';
      case InputFormat.SELECT_SEARCH:
      default:
        return 'string';
    }
  }
}
