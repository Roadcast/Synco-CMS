import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationHeaderComponent } from './configuration-header.component';

describe('ConfigurationHeaderComponent', () => {
  let component: ConfigurationHeaderComponent;
  let fixture: ComponentFixture<ConfigurationHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigurationHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigurationHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
