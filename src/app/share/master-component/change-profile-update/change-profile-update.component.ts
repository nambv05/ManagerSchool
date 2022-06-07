import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormControl} from "@angular/forms";
import {URL_LIST} from "../../../configs/url-list";
import {BaseDetail} from "../../../models/base-detail";
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import {TranslateService} from "@ngx-translate/core";
import {ConfirmationModalService} from "../../service/modal/confirmation-modal.service";
import {LoadingService} from "../../service/loading.service";
import {EmployeeApi} from "../../../services/api-service/emplyee-list.api";
import {AuthService} from "../../../services/api-service/auth.service";
import {GlobalDataService} from "../../../services/global-data.service";
import {HistoryUpdateApi} from "../../../services/api-service/history-update.api";

@Component({
  selector: 'app-change-profile-update',
  templateUrl: './change-profile-update.component.html',
  styleUrls: ['./change-profile-update.component.scss']
})
export class ChangeProfileUpdateComponent extends BaseDetail implements OnInit {
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
  // temporary_address: any;
  // permanent_address: any;
  // registration_address: any;
  childrenInformationOld: any = [];
  childrenInformationNew: any = [];
  employeesFamilyOld: any = [];
  employeesFamilyNew: any = [];
  addressHost: any = [];

  data = {
    personal: {},
    contact: {},
    education: {},
    socialInsurance: {},
    personnelProfile: {}
  };

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected location: Location,
    protected translate: TranslateService,
    protected confirmPopup: ConfirmationModalService,
    protected loading: LoadingService,
    protected historyUpdateApi: HistoryUpdateApi,
    private authService: AuthService,
    protected router: Router,
    protected globalDataService: GlobalDataService,
    protected activeRoute: ActivatedRoute,
  ) {
    super(historyUpdateApi, router, loading, confirmPopup, translate, globalDataService, activatedRoute, location);
    this.activeRoute.params.subscribe(params => {
      if (params)
        this.id = params.id;
    });
    this.getDetail(this.id);
  }

  ngOnInit(): void {
  }

  buildForm(val?): any {
    const form = super.buildForm(val);
    // thông tin cá nhân
    form.addControl('birth_day', new FormControl(val?.data_old_decode?.personal?.birth_day ?? ''));
    form.addControl('new_birth_day', new FormControl(val?.data_new_decode?.personal?.birth_day ?? ''));
    form.addControl('identification_number', new FormControl(val?.data_old_decode?.personal?.identification_number ?? ''));
    form.addControl('new_identification_number', new FormControl(val?.data_new_decode?.personal?.identification_number ?? ''));
    form.addControl('identification_date', new FormControl(val?.data_old_decode?.personal?.identification_date ?? ''));
    form.addControl('new_identification_date', new FormControl(val?.data_new_decode?.personal?.identification_date ?? ''));
    form.addControl('identification_place_of', new FormControl(val?.data_old_decode?.personal?.identification_place_of ?? ''));
    form.addControl('new_identification_place_of', new FormControl(val?.data_new_decode?.personal?.identification_place_of ?? ''));
    form.addControl('tax_code', new FormControl(val?.data_old_decode?.personal?.tax_code ?? ''));
    form.addControl('new_tax_code', new FormControl(val?.data_new_decode?.personal?.tax_code ?? ''));
    form.addControl('employees_address_permanent', new FormControl());
    form.addControl('new_employees_address_permanent', new FormControl());
    form.addControl('employees_address_temporary', new FormControl());
    form.addControl('new_employees_address_temporary', new FormControl());
    form.addControl('range_of_vehicle', new FormControl(val?.data_old_decode?.personal?.range_of_vehicle ?? ''));
    form.addControl('new_range_of_vehicle', new FormControl(val?.data_new_decode?.personal?.range_of_vehicle ?? ''));
    form.addControl('license_plates', new FormControl(val?.data_old_decode?.personal?.license_plates ?? ''));
    form.addControl('new_license_plates', new FormControl(val?.data_new_decode?.personal?.license_plates ?? ''));
    form.addControl('register_parking', new FormControl(val?.data_old_decode?.personal?.register_parking ?? ''));
    form.addControl('new_register_parking', new FormControl(val?.data_new_decode?.personal?.register_parking ?? ''));
    form.addControl('bank_number', new FormControl(val?.data_old_decode?.personal?.bank_number ?? ''));
    form.addControl('new_bank_number', new FormControl(val?.data_new_decode?.personal?.bank_number ?? ''));
    form.addControl('bank_name', new FormControl(val?.data_old_decode?.personal?.bank_name ?? ''));
    form.addControl('new_bank_name', new FormControl(val?.data_new_decode?.personal?.bank_name ?? ''));
    form.addControl('bank_user_name', new FormControl(val?.data_old_decode?.personal?.bank_user_name ?? ''));
    form.addControl('new_bank_user_name', new FormControl(val?.data_new_decode?.personal?.bank_user_name ?? ''));
    form.addControl('bank_branch', new FormControl(val?.data_old_decode?.personal?.bank_user_name ?? ''));
    form.addControl('new_bank_branch', new FormControl(val?.data_new_decode?.personal?.bank_user_name ?? ''));
    form.addControl('marital_status', new FormControl(val?.data_old_decode?.personal?.marital_status ?? ''));
    form.addControl('new_marital_status', new FormControl(val?.data_new_decode?.personal?.marital_status ?? ''));
    form.addControl('contact_user', new FormControl(val?.data_old_decode?.personal?.contact_user ?? ''));
    form.addControl('new_contact_user', new FormControl(val?.data_new_decode?.personal?.contact_user ?? ''));
    form.addControl('phone_contact_user', new FormControl(val?.data_old_decode?.personal?.phone_contact_user ?? ''));
    form.addControl('new_phone_contact_user', new FormControl(val?.data_new_decode?.personal?.phone_contact_user ?? ''));
    form.addControl('employees_childs', new FormControl([]));
    form.addControl('new_employees_childs', new FormControl([]));
    // thông tin trình độ học vấn
    form.addControl('school_name', new FormControl(val?.data_old_decode?.education?.school_name ?? ''));
    form.addControl('new_school_name', new FormControl(val?.data_new_decode?.education?.school_name ?? ''));
    form.addControl('degree', new FormControl(val?.data_old_decode?.education?.degree ?? ''));
    form.addControl('new_degree', new FormControl(val?.data_new_decode?.education?.degree ?? ''));
    form.addControl('majors', new FormControl(val?.data_old_decode?.education?.majors ?? ''));
    form.addControl('new_majors', new FormControl(val?.data_new_decode?.education?.majors ?? ''));
    form.addControl('foreign_language_level', new FormControl(val?.data_old_decode?.education?.foreign_language_level ?? ''));
    form.addControl('new_foreign_language_level', new FormControl(val?.data_new_decode?.education?.foreign_language_level ?? ''));
    form.addControl('language_certificate', new FormControl(val?.data_old_decode?.education?.language_certificate ?? ''));
    form.addControl('new_language_certificate', new FormControl(val?.data_new_decode?.education?.language_certificate ?? ''));
    form.addControl('specialized_certificate', new FormControl(val?.data_old_decode?.education?.specialized_certificate ?? ''));
    form.addControl('new_specialized_certificate', new FormControl(val?.data_new_decode?.education?.specialized_certificate ?? ''));
    form.addControl('other_certificate', new FormControl(val?.data_old_decode?.education?.other_certificate ?? ''));
    form.addControl('new_other_certificate', new FormControl(val?.data_new_decode?.education?.other_certificate ?? ''));
    //thông tin liên hệ
    form.addControl('phone_number', new FormControl(val?.data_old_decode?.contact?.other_certificate ?? ''));
    form.addControl('new_phone_number', new FormControl(val?.data_new_decode?.contact?.other_certificate ?? ''));
    form.addControl('chatwork_account', new FormControl(val?.data_old_decode?.contact?.other_certificate ?? ''));
    form.addControl('new_chatwork_account', new FormControl(val?.data_new_decode?.contact?.other_certificate ?? ''));
    form.addControl('skype_account', new FormControl(val?.data_old_decode?.contact?.other_certificate ?? ''));
    form.addControl('new_skype_account', new FormControl(val?.data_new_decode?.contact?.other_certificate ?? ''));
    form.addControl('facebook_link', new FormControl(val?.data_old_decode?.contact?.other_certificate ?? ''));
    form.addControl('new_facebook_link', new FormControl(val?.data_new_decode?.contact?.other_certificate ?? ''));
    form.addControl('personal_email', new FormControl(val?.data_old_decode?.contact?.other_certificate ?? ''));
    form.addControl('new_personal_email', new FormControl(val?.data_new_decode?.contact?.other_certificate ?? ''));
    //thông tin bảo hiểm xã hội
    form.addControl('insurance_id', new FormControl(val?.data_old_decode?.socialInsurance?.insurance_id ?? ''));
    form.addControl('new_insurance_id', new FormControl(val?.data_new_decode?.socialInsurance?.insurance_id ?? ''));
    form.addControl('place_of_birth', new FormControl(val?.data_old_decode?.socialInsurance?.place_of_birth ?? ''));
    form.addControl('new_place_of_birth', new FormControl(val?.data_new_decode?.socialInsurance?.place_of_birth ?? ''));
    form.addControl('employees_address_registration_book', new FormControl());
    form.addControl('new_employees_address_registration_book', new FormControl());
    form.addControl('name_host', new FormControl(val?.data_old_decode?.socialInsurance?.name_host ?? ''));
    form.addControl('new_name_host', new FormControl(val?.data_new_decode?.socialInsurance?.name_host ?? ''));
    form.addControl('birthday_host', new FormControl(val?.data_old_decode?.socialInsurance?.birthday_host ?? ''));
    form.addControl('new_birthday_host', new FormControl(val?.data_new_decode?.socialInsurance?.birthday_host ?? ''));
    form.addControl('address_host', new FormControl());
    form.addControl('new_address_host', new FormControl());
    form.addControl('relationship_host', new FormControl(val?.data_old_decode?.socialInsurance?.relationship_host ?? ''));
    form.addControl('new_relationship_host', new FormControl(val?.data_new_decode?.socialInsurance?.relationship_host ?? ''));
    form.addControl('medical_facility', new FormControl(val?.data_old_decode?.socialInsurance?.medical_facility ?? ''));
    form.addControl('new_medical_facility', new FormControl(val?.data_new_decode?.socialInsurance?.medical_facility ?? ''));
    form.addControl('employees_family', new FormControl());
    form.addControl('new_employees_family', new FormControl());
    //thông tin hồ sơ nhân sự
    form.addControl('curriculum_vitae', new FormControl(val?.data_old_decode?.personnelProfile?.curriculum_vitae ?? ''));
    form.addControl('new_curriculum_vitae', new FormControl(val?.data_new_decode?.personnelProfile?.curriculum_vitae ?? ''));
    form.addControl('copy_of_identify_card', new FormControl(val?.data_old_decode?.personnelProfile?.copy_of_identify_card ?? ''));
    form.addControl('new_copy_of_identify_card', new FormControl(val?.data_new_decode?.personnelProfile?.copy_of_identify_card ?? ''));
    form.addControl('copy_of_birth_certificate', new FormControl(val?.data_old_decode?.personnelProfile?.copy_of_birth_certificate ?? ''));
    form.addControl('new_copy_of_birth_certificate', new FormControl(val?.data_new_decode?.personnelProfile?.copy_of_birth_certificate ?? ''));
    form.addControl('health_certificate', new FormControl(val?.data_old_decode?.personnelProfile?.health_certificate ?? ''));
    form.addControl('new_health_certificate', new FormControl(val?.data_new_decode?.personnelProfile?.health_certificate ?? ''));
    form.addControl('copy_of_registration_book', new FormControl(val?.data_old_decode?.personnelProfile?.copy_of_registration_book ?? ''));
    form.addControl('new_copy_of_registration_book', new FormControl(val?.data_new_decode?.personnelProfile?.copy_of_registration_book ?? ''));
    form.addControl('copy_of_degree', new FormControl(val?.data_old_decode?.personnelProfile?.copy_of_degree ?? ''));
    form.addControl('new_copy_of_degree', new FormControl(val?.data_new_decode?.personnelProfile?.copy_of_degree ?? ''));

    if (val) {
      this.childrenInformationOld = val.data_old_decode?.personal?.employees_childs;
      this.childrenInformationNew = val.data_new_decode?.personal?.employees_childs;
      this.employeesFamilyOld = val.data_old_decode?.socialInsurance?.employees_family;
      this.employeesFamilyNew = val.data_new_decode?.socialInsurance?.employees_family;
    }

    form.addControl('data', new FormControl({}));
    const data: any = {};
    data.personal = {
      birth_day: form.get('new_birth_day').value,
      identification_number: form.get('new_identification_number').value,
      identification_date: form.get('new_identification_date').value,
      identification_place_of: form.get('new_identification_place_of').value,
      tax_code: form.get('new_tax_code').value,
      employees_address_permanent: form.get('new_employees_address_permanent').value,
      employees_address_temporary: form.get('new_employees_address_temporary').value,
      range_of_vehicle: form.get('new_range_of_vehicle').value,
      license_plates: form.get('new_license_plates').value,
      register_parking: form.get('new_register_parking').value,
      bank_number: form.get('new_bank_number').value,
      bank_name: form.get('new_bank_name').value,
      bank_user_name: form.get('new_bank_user_name').value,
      bank_branch: form.get('new_bank_branch').value,
      marital_status: form.get('new_marital_status').value,
      contact_user: form.get('new_contact_user').value,
      phone_contact_user: form.get('new_phone_contact_user').value,
      employees_childs: form.get('new_employees_childs').value,
    };
    data.education = {
      school_name: form.get('new_school_name').value,
      degree: form.get('new_degree').value,
      majors: form.get('new_majors').value,
      foreign_language_level: form.get('new_foreign_language_level').value,
      language_certificate: form.get('new_language_certificate').value,
      specialized_certificate: form.get('new_specialized_certificate').value,
      other_certificate: form.get('new_other_certificate').value,
    };
    data.contact = {
      phone_number: form.get('new_phone_number').value,
      chatwork_account: form.get('new_chatwork_account').value,
      skype_account: form.get('new_skype_account').value,
      facebook_link: form.get('new_facebook_link').value,
      personal_email: form.get('new_personal_email').value,
    };
    data.socialInsurance = {
      insurance_id: form.get('new_insurance_id').value,
      place_of_birth: form.get('new_place_of_birth').value,
      employees_address_registration_book: form.get('new_employees_address_registration_book').value,
      name_host: form.get('new_name_host').value,
      birthday_host: form.get('new_birthday_host').value,
      address_host: form.get('new_address_host').value,
      relationship_host: form.get('new_relationship_host').value,
      medical_facility: form.get('new_medical_facility').value,
      employees_family: form.get('new_employees_family').value,
    };
    data.personnelProfile = {
      curriculum_vitae: form.get('new_curriculum_vitae').value,
      copy_of_identify_card: form.get('new_copy_of_identify_card').value,
      copy_of_birth_certificate: form.get('new_copy_of_birth_certificate').value,
      health_certificate: form.get('new_health_certificate').value,
      copy_of_registration_book: form.get('new_copy_of_registration_book').value,
      copy_of_degree: form.get('new_copy_of_degree').value,
    };
    form.get('data').setValue(data);

    this.globalDataService.addForm(form);
    this.isShowForm = true;
    return form;


  }
}
