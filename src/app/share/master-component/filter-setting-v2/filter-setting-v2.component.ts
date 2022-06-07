import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { TableHeader, TableHeaderModel } from '../../../models/table-header.model';
import { PersistStateScreen } from '../../../configs/persist-state-screen';
import { Select2Option, Select2OptionModel } from '../../../models/select2-option.model';
import { InputFormat, TypeFilter } from '../../../configs/input-format';
import { FormControl, FormGroup } from '@angular/forms';
import { LoadingService } from '../../service/loading.service';
import { FilterSetting } from '../../../configs/filter-setting';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-filter-setting-v2',
  templateUrl: './filter-setting-v2.component.html',
  styleUrls: ['./filter-setting-v2.component.scss']
})
export class FilterSettingV2Component implements OnInit, OnChanges {

  @Input() columns: Array<TableHeaderModel> = [];
  @Input() criteria: Array<Array<string>> = [];
  @Input() screenId: PersistStateScreen;
  @Input() isFilter: Boolean;
  @Output() filtersChange = new EventEmitter<any>();
  maxDate = '9999-12-31';

  filterForm: Array<{
    conditions: Array<{ name: string, value: string }>,
    select2Option?: Select2OptionModel,
    type: TypeFilter,
    form: FormGroup
  }> = [];
  filterColumns: Array<TableHeader>;
  flagCheck = false;

  constructor(
    private loading: LoadingService,
    private translate: TranslateService
  ) {
  }

  ngOnInit(): void {
    this.openPopup();
    this.onAdd();
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
  }

  onDelete(index): void {
    this.filterForm.splice(index, 1);
  }

  onAdd(): void {
    for(let i in this.filterColumns){
      let opt:TableHeader = this.filterColumns[i];
      if(opt.isFilter){
        let conditions = FilterSetting[opt.type];
        this.filterForm.push(this.buildFilterForm({
          compareField: opt.column,
          condition: '',
          compareValue: '' }));
        break;
      }
    }

    //

  }

  onReset(): void {
    this.filterForm = [];
    this.onApply();
  }

  onApply(): void {
    // emit data
    let param = { fields:[], conds: [], values: [] };
    this.filterForm.filter(v =>
      // clear all no-typing filter
      v.type === 'date' || (
          String(v.form.get('compareField').value).trim()
          && String(v.form.get('condition').value).trim()
          && String(v.form.get('compareValue').value).trim()
      )
    ).map(v => {
      // merge condition to array
      let compareValue = v.form.value.compareValue;
      if (v.type === 'date' && v.form.value.compareValue == '')
        compareValue = '0000-01-01';
      param.fields.push(v.form.value.compareField);
      param.conds.push(v.form.value.condition);
      param.values.push(typeof compareValue === 'string' ? String(compareValue).trim() : compareValue);
    });

    this.filtersChange.emit(param);
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
        return moment().format('YYYY-MM-DD');
      case 'number':
        return '0';
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
