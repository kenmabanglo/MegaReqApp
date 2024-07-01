import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserApproverComponent } from './user-approver.component';

describe('UserApproverComponent', () => {
  let component: UserApproverComponent;
  let fixture: ComponentFixture<UserApproverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserApproverComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserApproverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
