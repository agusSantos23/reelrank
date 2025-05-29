import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SliderRatingComponent } from './slider-rating.component';
import { SimpleChange } from '@angular/core';

describe('SliderRatingComponent', () => {
  let component: SliderRatingComponent;
  let fixture: ComponentFixture<SliderRatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SliderRatingComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SliderRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize internalCurrentValue to min on ngOnInit if externalRating is undefined', () => {
    component.externalRating = undefined;
    component.ngOnInit();
    expect(component.internalCurrentValue).toBe(component.min);
    expect(component.hasInteracted).toBeFalse();
  });

  it('should initialize internalCurrentValue based on externalRating on ngOnInit', () => {
    component.max = 10;
    component.externalRating = 50; 
    component.ngOnInit();
    expect(component.internalCurrentValue).toBe(5);
    expect(component.hasInteracted).toBeTrue();
  });

  it('should update internalCurrentValue on ngOnChanges when max changes', () => {
    component.max = 50;
    component.ngOnChanges({
      max: new SimpleChange(10, 50, false)
    });
    expect(component.internalCurrentValue).toBe(component.min); 
  });

  it('should update internalCurrentValue and hasInteracted on ngOnChanges when externalRating changes', () => {
    component.max = 10;
    component.externalRating = 30; 
    component.ngOnChanges({
      externalRating: new SimpleChange(undefined, 30, true)
    });
    expect(component.internalCurrentValue).toBe(3);
    expect(component.hasInteracted).toBeTrue();

    component.externalRating = undefined;
    component.ngOnChanges({
      externalRating: new SimpleChange(30, undefined, false)
    });
    expect(component.internalCurrentValue).toBe(component.min);
    expect(component.hasInteracted).toBeFalse();
  });

  it('should update internalCurrentValue and set isDragging true on onSliderInput', () => {
    component.onSliderInput('5');
    expect(component.internalCurrentValue).toBe(5);
    expect(component.hasInteracted).toBeTrue();
    expect(component.isDragging).toBeTrue();
  });

  it('should not update internalCurrentValue if disabled on onSliderInput', () => {
    component.isDisable = true;
    component.internalCurrentValue = 0;
    component.onSliderInput('5');
    expect(component.internalCurrentValue).toBe(0);
  });

  it('should emit real rating and reset isDragging on onSliderMouseUp', () => {
    spyOn(component.ratingChange, 'emit');
    component.isDragging = true;
    component.internalCurrentValue = 5;
    component.max = 10;
    component.onSliderMouseUp();
    expect(component.ratingChange.emit).toHaveBeenCalledWith(50); // (5/10) * 100 = 50
    expect(component.isDragging).toBeFalse();
  });

  it('should not emit real rating if not dragging on onSliderMouseUp', () => {
    spyOn(component.ratingChange, 'emit');
    component.isDragging = false;
    component.onSliderMouseUp();
    expect(component.ratingChange.emit).not.toHaveBeenCalled();
  });

  it('should ensure max range between 1 and 100', () => {
    component.max = 0;
    component.ngOnInit();
    expect(component.max).toBe(1);

    component.max = 200;
    component.ngOnInit();
    expect(component.max).toBe(100);

    component.max = 50;
    component.ngOnInit();
    expect(component.max).toBe(50);
  });

  it('should apply "not-allowed" cursor when disabled', () => {
    component.isDisable = true;
    fixture.detectChanges();
    const inputElement = fixture.nativeElement.querySelector('input[type="range"]');
    expect(inputElement.style.cursor).toBe('not-allowed');
  });

  it('should apply "pointer" cursor when not disabled', () => {
    component.isDisable = false;
    fixture.detectChanges();
    const inputElement = fixture.nativeElement.querySelector('input[type="range"]');
    expect(inputElement.style.cursor).toBe('pointer');
  });

  it('should show 0 span when showZero is true', () => {
    component.showZero = true;
    fixture.detectChanges();
    const spanElement = fixture.nativeElement.querySelector('span');
    expect(spanElement).toBeTruthy();
    expect(spanElement.textContent).toContain('0');
  });

  it('should not show 0 span when showZero is false', () => {
    component.showZero = false;
    fixture.detectChanges();
    const spanElement = fixture.nativeElement.querySelector('span');
    expect(spanElement).toBeFalsy();
  });
});