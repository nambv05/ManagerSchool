import {Component, Input, OnInit} from '@angular/core';
import {ControlContainer, FormGroupDirective} from "@angular/forms";

@Component({
  selector: 'app-change-profile-update-input',
  templateUrl: './change-profile-update-input.component.html',
  styleUrls: ['./change-profile-update-input.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class ChangeProfileUpdateInputComponent implements OnInit {
  @Input() fieldNameOld: any;
  @Input() fieldNameNew: any;
  @Input() typeInput = 'text';
  @Input() formatDate = 'DD-MM-YYYY';
  constructor() { }

  ngOnInit(): void {
  }

}
