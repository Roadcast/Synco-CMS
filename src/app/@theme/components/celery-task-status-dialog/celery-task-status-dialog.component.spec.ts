import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CeleryTaskStatusDialogComponent } from './celery-task-status-dialog.component';

describe('CeleryTaskStatusDialogComponent', () => {
  let component: CeleryTaskStatusDialogComponent;
  let fixture: ComponentFixture<CeleryTaskStatusDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CeleryTaskStatusDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CeleryTaskStatusDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
