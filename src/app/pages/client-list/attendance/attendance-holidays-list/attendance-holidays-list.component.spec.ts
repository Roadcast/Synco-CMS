import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceHolidaysListComponent } from './attendance-holidays-list.component';

describe('AttendanceHolidaysListComponent', () => {
  let component: AttendanceHolidaysListComponent;
  let fixture: ComponentFixture<AttendanceHolidaysListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttendanceHolidaysListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendanceHolidaysListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
