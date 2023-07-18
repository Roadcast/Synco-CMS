import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {TypeAheadComponent} from './type-ahead.component';

describe('TypeAheadComponent', () => {
	let component: TypeAheadComponent;
	let fixture: ComponentFixture<TypeAheadComponent>;

    beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [TypeAheadComponent],
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TypeAheadComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
