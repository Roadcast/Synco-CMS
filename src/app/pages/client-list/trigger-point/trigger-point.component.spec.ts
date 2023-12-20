import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TriggerPointComponent } from './trigger-point.component';

describe('TriggerPointComponent', () => {
  let component: TriggerPointComponent;
  let fixture: ComponentFixture<TriggerPointComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TriggerPointComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TriggerPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
