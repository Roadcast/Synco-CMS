import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimeDataTableComponent } from './prime-data-table.component';

describe('PrimeDataTableComponent', () => {
  let component: PrimeDataTableComponent;
  let fixture: ComponentFixture<PrimeDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrimeDataTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrimeDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
