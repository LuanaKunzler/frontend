import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorReadComponent } from './author-read.component';

describe('AuthorReadComponent', () => {
  let component: AuthorReadComponent;
  let fixture: ComponentFixture<AuthorReadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthorReadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorReadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
