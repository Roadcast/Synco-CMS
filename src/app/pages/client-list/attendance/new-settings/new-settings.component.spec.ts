import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSettingsComponent } from './new-settings.component';

describe('NewSettingsComponent', () => {
  let component: NewSettingsComponent;
  let fixture: ComponentFixture<NewSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
