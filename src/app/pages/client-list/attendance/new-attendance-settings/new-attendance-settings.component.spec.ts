import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAttendanceSettingsComponent } from './new-attendance-settings.component';

describe('NewAttendanceSettingsComponent', () => {
  let component: NewAttendanceSettingsComponent;
  let fixture: ComponentFixture<NewAttendanceSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewAttendanceSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewAttendanceSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
