import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {BaseSelectMaster} from "../../../models/base-select-master";
import {BaseDetail} from "../../../models/base-detail";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Location} from "@angular/common";
import {Router} from "@angular/router";
import {LoadingService} from "../../service/loading.service";
import {ConfirmationModalService} from "../../service/modal/confirmation-modal.service";
import {EmployeeApi} from "../../../services/api-service/emplyee-list.api";
import {TranslateService} from "@ngx-translate/core";
import {GlobalDataService} from "../../../services/global-data.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AddressApi} from "../../../services/api-service/address.api";
import {BaseDetailPopup} from "../../../models/base-detail-popup";

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit {
  currentObj = 'ADDRESS';
  itemsProvince = [];
  itemsDistrictByProvince = {};
  itemsWardsByDistrict = {};
  @Input() address: any;
  @Input() legend: any;
  @Output() changeAddress = new EventEmitter();
  form: FormGroup;

  @Input() isSelected = false;

  constructor(
    protected location: Location,
    protected router: Router,
    protected loading: LoadingService,
    protected confirmPopup: ConfirmationModalService,
    protected addressApi: AddressApi,
    protected translate: TranslateService,
    protected globalDataService: GlobalDataService,
    protected ngbModal: NgbModal,
  ) {
    // super(addressApi, router, loading, confirmPopup, translate, globalDataService, ngbModal);
  }

  ngOnInit(): void {
    this.loadMasterData();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.addressApi.getDistricts({province_id: this.address?.provincial_data?.id}).subscribe(res => {
      this.itemsDistrictByProvince[this.address?.provincial_data?.id] = res;
    });
    this.addressApi.getWards({district_id: this.address?.district_data?.id}).subscribe(res => {
      this.itemsWardsByDistrict[this.address?.district_data?.id] = res;
    });
    return this.buildForm(this.address);

  }

  loadMasterData() {
    this.addressApi.getProvinces().subscribe(res => {
      this.itemsProvince = res;
    });
  }

  buildForm(val?): any {
    this.form = new FormGroup({
      provincial: new FormControl(val ? val.provincial : '', [Validators.required]),
      district: new FormControl(val ? val.district : '', []),
      commune: new FormControl(val ? val.commune : '', []),
      address: new FormControl(val ? val.address : '', []),

    });
    this.globalDataService.addForm(this.form);
    this.formChanges(this.form);

    this.form.valueChanges.subscribe(() => this.form.dirty && this.changeAddress.emit(this.form.getRawValue()))
  }


  formChanges(form: FormGroup) {
    // provinces change, get new districts list
    form.get('provincial').valueChanges.subscribe(newVal => {
      form.get('district').setValue('');
      form.get('commune').setValue('');
      if (newVal && !this.itemsDistrictByProvince[newVal]) {
        this.loading.showAppLoading();
        this.addressApi.getDistricts({province_id: newVal}).subscribe(res => {
          this.loading.hideAppLoading();
          this.itemsDistrictByProvince[newVal] = res;
        });
      }
    });

    form.get('district').valueChanges.subscribe(newVal => {
      form.get('commune').setValue('');
      if (newVal && !this.itemsWardsByDistrict[newVal]) {
        this.loading.showAppLoading();
        this.addressApi.getWards({district_id: newVal}).subscribe(res => {
          this.loading.hideAppLoading();
          this.itemsWardsByDistrict[newVal] = res;
        });
      }
    });
  }

}
