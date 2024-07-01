import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RsFormComponent } from './rs-form.component';

describe('RsFormComponent', () => {
  let component: RsFormComponent;
  let fixture: ComponentFixture<RsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RsFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
