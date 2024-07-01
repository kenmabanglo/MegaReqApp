import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TalentRequisitionComponent } from './talent-requisition.component';

describe('TalentRequisitionComponent', () => {
  let component: TalentRequisitionComponent;
  let fixture: ComponentFixture<TalentRequisitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TalentRequisitionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TalentRequisitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
