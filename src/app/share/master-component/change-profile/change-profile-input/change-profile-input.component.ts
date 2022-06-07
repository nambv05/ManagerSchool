import {Component, Input, OnInit} from '@angular/core';
import {ControlContainer, FormGroupDirective} from "@angular/forms";

@Component({
  selector: 'app-change-profile-input',
  templateUrl: './change-profile-input.component.html',
  styleUrls: ['./change-profile-input.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class ChangeProfileInputComponent implements OnInit {
  @Input() fieldName: any;
  @Input() typeInput = 'text';
  @Input() formatDate = 'DD-MM-YYYY'
  constructor() { }

  ngOnInit(): void {
  }

}
