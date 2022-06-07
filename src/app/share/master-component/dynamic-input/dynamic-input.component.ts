import {Component, EventEmitter, forwardRef, Input, OnInit, Output} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from '@angular/forms';
import {InputFormat} from '../../../configs/input-format';
import {SelectSearchOption, SelectSearchOptionModel} from '../../../models/select-search-option.model';
import {Select2Option, Select2OptionModel} from '../../../models/select2-option.model';
import {NumberFormat, NumberFormatModel} from '../../../models/number-format.model';

@Component({
  selector: 'app-dynamic-input',
  templateUrl: './dynamic-input.component.html',
  styleUrls: ['./dynamic-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DynamicInputComponent),
      multi: true,
    },
  ]
})
export class DynamicInputComponent implements OnInit, ControlValueAccessor {
  TableCellFormat = InputFormat;
  @Input() class: string | string[] | Set<string> | { [klass: string]: any; };
  @Input() type: InputFormat;

  // this variable only has value when type = TableCellFormat.SELECT_SEARCH
  @Input() select2Option: Select2OptionModel = new Select2Option();

  //  this variable only has value when type = TableCellFormat.NUMBER_INPUT
  @Input() numberFormat: NumberFormatModel = new NumberFormat();

  // this variable only has value when type = TableCellFormat.SELECT_SEARCH_W_POPUP
  @Input() searchOption: SelectSearchOptionModel = new SelectSearchOption();

  @Input() isPrimaryKey = false;
  @Input() isDisabled = false;
  @Input() isReadOnly = false;
  @Input() minValue: string;
  @Input() maxValue: string;
  @Input() format: string = 'DD-MM-YYYY HH:mm';
  @Input() isShowTimePicker = false;

  @Output() chooseMasterPopup = new EventEmitter<any>();

  value = new FormControl();

  customTimePicker = 'custom-btn-date-picker'

  private onChangeModel = (v: any) => {
  };
  protected onTouchModel = (v: any) => {
  };

  constructor() {
    this.value.valueChanges.subscribe(val => {
      if (this.value.dirty) {
        this.onChangeModel(val);
      }
    });
    this.value.statusChanges.subscribe(val => {
      this.onTouchModel(val);
    });
  }

  ngOnInit(): void {
  }

  onTouched(): void {
    if (this.value.dirty) {
      //this.isPrimaryKey ? this.value.setValue(this.value.value.trim().toLocaleUpperCase()) : this.value.setValue(this.value.value.trim());
    }
    this.onTouchModel('touched');
  }

  registerOnChange(fn: any): void {
    this.onChangeModel = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchModel = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.value.disable();
    } else {
      this.value.enable();
    }
  }

  writeValue(value: boolean): void {
    this.value.setValue(value);
  }

  onChooseMasterPopup(val: unknown): void {
    this.chooseMasterPopup.emit(val);
  }
}
