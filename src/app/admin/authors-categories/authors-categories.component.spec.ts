import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorsCategoriesComponent } from './authors-categories.component';

describe('AuthorsCategoriesComponent', () => {
  let component: AuthorsCategoriesComponent;
  let fixture: ComponentFixture<AuthorsCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthorsCategoriesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorsCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
