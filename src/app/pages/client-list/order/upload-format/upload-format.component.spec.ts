import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadFormatComponent } from './upload-format.component';

describe('UploadFormatComponent', () => {
  let component: UploadFormatComponent;
  let fixture: ComponentFixture<UploadFormatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadFormatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadFormatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
