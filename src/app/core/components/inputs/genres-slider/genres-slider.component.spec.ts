import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenresSliderComponent } from './genres-slider.component';

describe('GenresSliderComponent', () => {
  let component: GenresSliderComponent;
  let fixture: ComponentFixture<GenresSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenresSliderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenresSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
