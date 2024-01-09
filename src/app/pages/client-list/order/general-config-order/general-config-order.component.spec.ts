import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralConfigOrderComponent } from './general-config-order.component';

describe('GeneralConfigOrderComponent', () => {
  let component: GeneralConfigOrderComponent;
  let fixture: ComponentFixture<GeneralConfigOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralConfigOrderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralConfigOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
