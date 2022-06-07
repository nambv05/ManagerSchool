import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DepartmentApi } from 'src/app/services/api-service/department.api';
import { LoadingService } from 'src/app/share/service/loading.service';

@Component({
  selector: 'app-share-department-one',
  templateUrl: './share-department-one.component.html',
  styleUrls: ['./share-department-one.component.scss']
})
export class ShareDepartmentOneComponent implements OnInit {

  @Input() item: any;
  @Input() item2: any;
  @Input() level: any = 0;

  @Input() options = {allowEdit: false, allowRemove: false, allowShowUsers: false};
  @Input() allowUnlinkParent = false;
  @Input() allowSelect = false;
  @Input() selected = [];

  @Output() eventEdit = new EventEmitter<any>();
  @Output() eventRemove = new EventEmitter<any>();
  @Output() eventShowUser = new EventEmitter<any>();
  @Output() eventUnLinkParentList = new EventEmitter<any>();
  @Output() eventSelect = new EventEmitter<any>();

  @Output() itemChange = new EventEmitter<any>(); 

  itemsChild = [];
  isShowList:boolean = false;

  constructor(
    protected departmentApi: DepartmentApi,
    protected loading: LoadingService,
    protected translate: TranslateService
  ) { }

  ngOnInit() {
     this.level = parseInt(this.level);
  }

  showListSub(){
    if(this.allowSelect && this.selected.indexOf(this.item?.id) >=0){
      //return;
    }
    if(this.itemsChild.length == 0){
      this.loading.showAppLoading();
      this.departmentApi.getAll({'parent_id' : this.item?.id}).subscribe(res => {
        this.loading.hideAppLoading();
          this.itemsChild = res.items;
          this.isShowList = !this.isShowList;
      });
    }else{
      this.isShowList = !this.isShowList;
    }
  }

  onClickEdit(item, isChild = false){
    this.eventEdit.emit(item);
  }
  onClickRemove(item, isChild = false){
    this.eventRemove.emit(item);
  }
  onClickShowUser(item, isChild = false){
    this.eventShowUser.emit(item);
  }
  onClickUnlinkParent(item, isChild = false){
    if(isChild){
      item.isDeleted = true;
    }else{
      this.item.isDeleted = true;
    }
    this.eventUnLinkParentList.emit(item);
  }

  onClickSelect(value = 0){
    if(value == 0){
      this.selected.splice(this.selected.indexOf(this.item.id), 1);
    }else if(value == 1){
      this.selected.push(this.item.id);
    }
    this.eventSelect.emit({item: this.item, value:value});
  }

  onClickSelectChild($event){
    if($event.value == 0){
      this.selected.splice(this.selected.indexOf($event.item.id), 1);
    }else if($event.value == 1){
      this.selected.push($event.item.id);
    }
    this.eventSelect.emit({item: $event.item, value:$event.value});
  }



  getMessage(key: string, options:any = {}): string{
    return this.translate.instant(key, options);
  }

  clickCheck(status: boolean){
    if(status){
    //  this.selected.push(this.item.id);
    }else{
     // this.selected.splice(this.selected.indexOf(this.item.id), 1);
    }
    // this.eventSelect.emit();
  }

}
