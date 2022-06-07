import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {LoadingService} from 'src/app/share/service/loading.service';
import {EmployeeApi} from "src/app/services/api-service/emplyee-list.api";
import {ConfirmationModalService} from 'src/app/share/service/modal/confirmation-modal.service';
import {Location} from '@angular/common';
import {BaseDetail} from "src/app/models/base-detail";
import {GlobalDataService} from "src/app/services/global-data.service";
import {MasterSelectSearch} from "../../../configs/master-select-search";
import {URL_LIST} from "../../../configs/url-list";
import {
  historyUpdateGender,
  historyUpdateStatus,
  historyUpdateWorkingStatus
} from 'src/app/configs/history-update-config';
import {FormArray, FormControl, FormGroup} from "@angular/forms";
import {AuthService} from "../../../services/api-service/auth.service";

@Component({
  selector: 'app-change-profile',
  templateUrl: './change-profile.component.html',
  styleUrls: ['./change-profile.component.scss']
})
export class ChangeProfileComponent extends BaseDetail implements OnInit {
  currentObj = 'change_profile';

  base_url = URL_LIST.HISTORY_UPDATE_LIST;
  @Input() flag_button = true;
  @Input() id: any;
  @ViewChild('formChildren') formChildren;
  @ViewChild('formAddressPermanent') formAddressPermanent;
  @ViewChild('formAddressTemporary') formAddressTemporary;
  @ViewChild('formEmployeeFamily') formEmployeeFamily;
  @ViewChild('formAddressRegistration') formAddressRegistration;
  img_src: any;
  // employees_address_temporary: any;
  // employees_address_permanent: any;
  // registration_address: any;
  childrenInformation: any = [];
  employeesFamily: any = [];
  addressHost: any = [];

  data = {
    personal: {},
    contact: {},
    education: {},
    socialInsurance: {},
    personnelProfile: {}
  };

  masterSelectSearch = MasterSelectSearch;
  historyUpdateGender: Array<any> = Object.keys(historyUpdateGender).filter(v => isNaN(Number(v)))
    .map((key) => ({name: key, value: historyUpdateGender[key]}));
  historyUpdateStatus: Array<any> = Object.keys(historyUpdateStatus).filter(v => isNaN(Number(v)))
    .map((key) => ({name: key, value: historyUpdateStatus[key]}));
  historyUpdateWorkingStatus: Array<any> = Object.keys(historyUpdateWorkingStatus).filter(v => isNaN(Number(v)))
    .map((key) => ({name: key, value: historyUpdateWorkingStatus[key]}));

  formatDate = 'DD-MM-YYYY';

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected location: Location,
    protected translate: TranslateService,
    protected confirmPopup: ConfirmationModalService,
    protected loading: LoadingService,
    protected employeeApi: EmployeeApi,
    private authService: AuthService,
    protected router: Router,
    protected globalDataService: GlobalDataService,
  ) {
    super(employeeApi, router, loading, confirmPopup, translate, globalDataService, activatedRoute, location);
    const employee_id = this.authService.currentUserValue?.user?.employee_id;
    this.getDetail(employee_id);
  }

  ngOnInit(): void {
  }

  back(): void {
    this.globalDataService.checkFormChange('history update detail/edit back').subscribe((allowChange) => {
      if (allowChange) {
        this.location.back();
      }
    });
  }

  buildForm(val?): any {
    const form = super.buildForm(val);

    form.addControl('birth_day', new FormControl(val?.birth_day ?? ''));
    form.addControl('identification_number', new FormControl(val?.identification_number ?? ''));
    form.addControl('identification_date', new FormControl(val?.identification_date ?? ''));
    form.addControl('identification_place_of', new FormControl(val?.identification_place_of ?? ''));
    form.addControl('tax_code', new FormControl(val?.tax_code ?? ''));
    form.addControl('employees_address_permanent', new FormControl());
    form.addControl('employees_address_temporary', new FormControl());
    form.addControl('range_of_vehicle', new FormControl(val?.range_of_vehicle ?? ''));
    form.addControl('license_plates', new FormControl(val?.license_plates ?? ''));
    form.addControl('register_parking', new FormControl(val?.register_parking ?? ''));
    form.addControl('bank_number', new FormControl(val?.bank_number ?? ''));
    form.addControl('bank_name', new FormControl(val?.bank_name ?? ''));
    form.addControl('bank_user_name', new FormControl(val?.bank_user_name ?? ''));
    form.addControl('bank_branch', new FormControl(val?.bank_user_name ?? ''));
    form.addControl('marital_status', new FormControl(val?.marital_status ?? ''));
    form.addControl('contact_user', new FormControl(val?.contact_user ?? ''));
    form.addControl('phone_contact_user', new FormControl(val?.phone_contact_user ?? ''));
    form.addControl('employees_childs', new FormControl([]));
    // thông tin trình độ học vấn
    form.addControl('school_name', new FormControl(val?.school_name ?? ''));
    form.addControl('degree', new FormControl(val?.degree ?? ''));
    form.addControl('majors', new FormControl(val?.majors ?? ''));
    form.addControl('foreign_language_level', new FormControl(val?.foreign_language_level ?? ''));
    form.addControl('language_certificate', new FormControl(val?.language_certificate ?? ''));
    form.addControl('specialized_certificate', new FormControl(val?.specialized_certificate ?? ''));
    form.addControl('other_certificate', new FormControl(val?.other_certificate ?? ''));
    //thông tin liên hệ
    form.addControl('phone_number', new FormControl(val?.other_certificate ?? ''));
    form.addControl('chatwork_account', new FormControl(val?.other_certificate ?? ''));
    form.addControl('skype_account', new FormControl(val?.other_certificate ?? ''));
    form.addControl('facebook_link', new FormControl(val?.other_certificate ?? ''));
    form.addControl('personal_email', new FormControl(val?.other_certificate ?? ''));
    //thông tin bảo hiểm xã hội
    form.addControl('insurance_id', new FormControl(val?.insurance_id ?? ''));
    form.addControl('place_of_birth', new FormControl(val?.place_of_birth ?? ''));
    form.addControl('employees_address_registration_book', new FormControl());
    form.addControl('name_host', new FormControl(val?.name_host ?? ''));
    form.addControl('birthday_host', new FormControl(val?.birthday_host ?? ''));
    form.addControl('address_host', new FormControl());
    form.addControl('relationship_host', new FormControl(val?.relationship_host ?? ''));
    form.addControl('medical_facility', new FormControl(val?.medical_facility ?? ''));
    form.addControl('employees_family', new FormControl());
    //thông tin hồ sơ nhân sự
    form.addControl('curriculum_vitae', new FormControl(val?.curriculum_vitae ?? ''));
    form.addControl('copy_of_identify_card', new FormControl(val?.copy_of_identify_card ?? ''));
    form.addControl('copy_of_birth_certificate', new FormControl(val?.copy_of_birth_certificate ?? ''));
    form.addControl('health_certificate', new FormControl(val?.health_certificate ?? ''));
    form.addControl('copy_of_registration_book', new FormControl(val?.copy_of_registration_book ?? ''));
    form.addControl('copy_of_degree', new FormControl(val?.copy_of_degree ?? ''));


    if (val) {
      this.childrenInformation = val.employees_childs;
      this.employeesFamily = val.employees_family;
    }

    form.addControl('data', new FormControl({}));
    const data: any = {};
    data.personal = {
      birth_day: form.get('birth_day').value,
      identification_number: form.get('identification_number').value,
      identification_date: form.get('identification_date').value,
      identification_place_of: form.get('identification_place_of').value,
      tax_code: form.get('tax_code').value,
      employees_address_permanent: form.get('employees_address_permanent').value,
      employees_address_temporary: form.get('employees_address_temporary').value,
      range_of_vehicle: form.get('range_of_vehicle').value,
      license_plates: form.get('license_plates').value,
      register_parking: form.get('register_parking').value,
      bank_number: form.get('bank_number').value,
      bank_name: form.get('bank_name').value,
      bank_user_name: form.get('bank_user_name').value,
      bank_branch: form.get('bank_branch').value,
      marital_status: form.get('marital_status').value,
      contact_user: form.get('contact_user').value,
      phone_contact_user: form.get('phone_contact_user').value,
      employees_childs: form.get('employees_childs').value,
    };
    data.education = {
      school_name: form.get('school_name').value,
      degree: form.get('degree').value,
      majors: form.get('majors').value,
      foreign_language_level: form.get('foreign_language_level').value,
      language_certificate: form.get('language_certificate').value,
      specialized_certificate: form.get('specialized_certificate').value,
      other_certificate: form.get('other_certificate').value,
    };
    data.contact = {
      phone_number: form.get('phone_number').value,
      chatwork_account: form.get('chatwork_account').value,
      skype_account: form.get('skype_account').value,
      facebook_link: form.get('facebook_link').value,
      personal_email: form.get('personal_email').value,
    };
    data.socialInsurance = {
      insurance_id: form.get('insurance_id').value,
      place_of_birth: form.get('place_of_birth').value,
      employees_address_registration_book: form.get('employees_address_registration_book').value,
      name_host: form.get('name_host').value,
      birthday_host: form.get('birthday_host').value,
      address_host: form.get('address_host').value,
      relationship_host: form.get('relationship_host').value,
      medical_facility: form.get('medical_facility').value,
      employees_family: form.get('employees_family').value,
    };
    data.personnelProfile = {
      curriculum_vitae: form.get('curriculum_vitae').value,
      copy_of_identify_card: form.get('copy_of_identify_card').value,
      copy_of_birth_certificate: form.get('copy_of_birth_certificate').value,
      health_certificate: form.get('health_certificate').value,
      copy_of_registration_book: form.get('copy_of_registration_book').value,
      copy_of_degree: form.get('copy_of_degree').value,
    };
    form.get('data').setValue(data);


    this.globalDataService.addForm(form);
    this.isShowForm = true;
    return form;
  }


  delete(): void {
  }

  onAccept(): void {
  }

  onReject(): void {
  }

}
