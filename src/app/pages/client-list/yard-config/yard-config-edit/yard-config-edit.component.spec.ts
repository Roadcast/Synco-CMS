import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YardConfigEditComponent } from './yard-config-edit.component';

describe('YardConfigEditComponent', () => {
  let component: YardConfigEditComponent;
  let fixture: ComponentFixture<YardConfigEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YardConfigEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YardConfigEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
