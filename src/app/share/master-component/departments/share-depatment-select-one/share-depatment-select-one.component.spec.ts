/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ShareDepatmentSelectOneComponent } from './share-depatment-select-one.component';

describe('ShareDepatmentSelectOneComponent', () => {
  let component: ShareDepatmentSelectOneComponent;
  let fixture: ComponentFixture<ShareDepatmentSelectOneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareDepatmentSelectOneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareDepatmentSelectOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
