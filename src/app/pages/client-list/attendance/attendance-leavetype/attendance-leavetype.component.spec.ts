import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceLeavetypeComponent } from './attendance-leavetype.component';

describe('AttendanceLeavetypeComponent', () => {
  let component: AttendanceLeavetypeComponent;
  let fixture: ComponentFixture<AttendanceLeavetypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttendanceLeavetypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendanceLeavetypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
