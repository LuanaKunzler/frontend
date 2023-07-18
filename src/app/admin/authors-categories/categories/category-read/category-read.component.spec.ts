import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryReadComponent } from './category-read.component';

describe('CategoryReadComponent', () => {
  let component: CategoryReadComponent;
  let fixture: ComponentFixture<CategoryReadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoryReadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryReadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
