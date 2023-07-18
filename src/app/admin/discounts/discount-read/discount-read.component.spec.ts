import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountReadComponent } from './discount-read.component';

describe('DiscountReadComponent', () => {
  let component: DiscountReadComponent;
  let fixture: ComponentFixture<DiscountReadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiscountReadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiscountReadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
