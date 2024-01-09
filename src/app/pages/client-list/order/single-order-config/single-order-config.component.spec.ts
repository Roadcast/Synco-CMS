import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleOrderConfigComponent } from './single-order-config.component';

describe('SingleOrderConfigComponent', () => {
  let component: SingleOrderConfigComponent;
  let fixture: ComponentFixture<SingleOrderConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleOrderConfigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleOrderConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
