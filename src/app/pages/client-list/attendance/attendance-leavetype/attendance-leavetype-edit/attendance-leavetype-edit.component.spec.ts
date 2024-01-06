import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceLeavetypeEditComponent } from './attendance-leavetype-edit.component';

describe('AttendanceLeavetypeEditComponent', () => {
  let component: AttendanceLeavetypeEditComponent;
  let fixture: ComponentFixture<AttendanceLeavetypeEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttendanceLeavetypeEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendanceLeavetypeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
