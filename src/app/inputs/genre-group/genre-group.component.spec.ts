import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenreGroupComponent } from './genre-group.component';

describe('GenreGroupComponent', () => {
  let component: GenreGroupComponent;
  let fixture: ComponentFixture<GenreGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenreGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenreGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
