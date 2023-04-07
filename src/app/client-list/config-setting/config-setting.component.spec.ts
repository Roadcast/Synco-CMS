import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigSettingComponent } from './config-setting.component';

describe('ConfigSettingComponent', () => {
  let component: ConfigSettingComponent;
  let fixture: ComponentFixture<ConfigSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigSettingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
