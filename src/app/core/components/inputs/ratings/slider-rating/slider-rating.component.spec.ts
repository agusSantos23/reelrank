import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderRatingComponent } from './slider-rating.component';

describe('SliderRatingComponent', () => {
  let component: SliderRatingComponent;
  let fixture: ComponentFixture<SliderRatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SliderRatingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SliderRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
