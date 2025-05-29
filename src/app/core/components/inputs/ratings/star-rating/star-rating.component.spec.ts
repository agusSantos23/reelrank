import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StarRatingComponent } from './star-rating.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SimpleChange } from '@angular/core';

describe('StarRatingComponent', () => {
  let component: StarRatingComponent;
  let fixture: ComponentFixture<StarRatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StarRatingComponent, NoopAnimationsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(StarRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize stars based on maxStars', () => {
    component.maxStars = 5;
    component.ngOnInit();
    expect(component.stars.length).toBe(5);
    expect(component.starAnimationStates.length).toBe(5);
    expect(component.stars.every(star => !star.filled)).toBeTrue();
  });

  it('should set internalRating to 0 if externalRating is undefined on init', () => {
    component.externalRating = undefined;
    component.ngOnInit();
    expect(component.internalRating).toBe(0);
    expect(component.stars.every(star => !star.filled)).toBeTrue();
  });

  it('should update stars and internalRating based on externalRating on init', () => {
    component.maxStars = 5;
    component.externalRating = 60; 
    component.ngOnInit();
    expect(component.internalRating).toBe(3); 
    expect(component.stars[0].filled).toBeTrue();
    expect(component.stars[1].filled).toBeTrue();
    expect(component.stars[2].filled).toBeTrue();
    expect(component.stars[3].filled).toBeFalse();
    expect(component.stars[4].filled).toBeFalse();
  });

  it('should update stars and internalRating when externalRating changes via ngOnChanges', () => {
    component.maxStars = 5;
    component.internalRating = 0; 

    component.ngOnChanges({
      externalRating: new SimpleChange(undefined, 80, true) 
    });
    expect(component.internalRating).toBe(4);
    expect(component.stars[0].filled).toBeTrue();
    expect(component.stars[1].filled).toBeTrue();
    expect(component.stars[2].filled).toBeTrue();
    expect(component.stars[3].filled).toBeTrue();
    expect(component.stars[4].filled).toBeFalse();

    component.ngOnChanges({
      externalRating: new SimpleChange(80, undefined, false)
    });
    expect(component.internalRating).toBe(0);
    expect(component.stars.every(star => !star.filled)).toBeTrue();
  });

  it('should set rating correctly', () => {
    component.maxStars = 5;
    component.setRating(3);
    expect(component.internalRating).toBe(3);
    expect(component.stars[0].filled).toBeTrue();
    expect(component.stars[1].filled).toBeTrue();
    expect(component.stars[2].filled).toBeTrue();
    expect(component.stars[3].filled).toBeFalse();
  });

  it('should emit ratingChange with converted percentage on setRating', () => {
    spyOn(component.ratingChange, 'emit');
    component.maxStars = 5;
    component.setRating(3); 
    expect(component.ratingChange.emit).toHaveBeenCalledWith(50);
  });

  it('should handleStarClick and call setRating if not disabled', () => {
    spyOn(component, 'setRating');
    spyOn(component, 'triggerStarAnimation');
    component.isDisable = false;
    component.handleStarClick(2); 
    expect(component.setRating).toHaveBeenCalledWith(3);
    expect(component.triggerStarAnimation).toHaveBeenCalledWith(2);
  });

  it('should not handleStarClick if disabled', () => {
    spyOn(component, 'setRating');
    component.isDisable = true;
    component.handleStarClick(2);
    expect(component.setRating).not.toHaveBeenCalled();
  });

  it('should update star display on handleStarHover if not disabled', () => {
    component.maxStars = 5;
    component.initializeStars();
    component.isDisable = false;
    component.handleStarHover(3); 
    expect(component.stars[0].filled).toBeTrue();
    expect(component.stars[1].filled).toBeTrue();
    expect(component.stars[2].filled).toBeTrue();
    expect(component.stars[3].filled).toBeTrue();
    expect(component.stars[4].filled).toBeFalse();
  });

  it('should not update star display on handleStarHover if disabled', () => {
    component.maxStars = 5;
    component.initializeStars();
    component.isDisable = true;
    component.handleStarHover(3);
    expect(component.stars.every(star => !star.filled)).toBeTrue(); 
  });

  it('should trigger star animation states', (done) => {
    component.maxStars = 1;
    component.initializeStars();
    component.triggerStarAnimation(0);
    expect(component.starAnimationStates[0]).toBe('clicked');
    setTimeout(() => {
      expect(component.starAnimationStates[0]).toBe('normal');
      done();
    }, 200);
  });

  it('should reset star display to internalRating', () => {
    component.maxStars = 5;
    component.internalRating = 4;
    component.updateStarDisplay(2); 
    component.resetStarDisplay(); 
    expect(component.stars[0].filled).toBeTrue();
    expect(component.stars[1].filled).toBeTrue();
    expect(component.stars[2].filled).toBeTrue();
    expect(component.stars[3].filled).toBeTrue();
    expect(component.stars[4].filled).toBeFalse();
  });

  it('should calculate star size correctly for different maxStars values', () => {
    component.maxStars = 3;
    component.calculateStarSize();
    expect(component.starSize).toBeCloseTo(50); 

    component.maxStars = 10;
    component.calculateStarSize();
    expect(component.starSize).toBeCloseTo(30);

    component.maxStars = 1;
    component.calculateStarSize();
    expect(component.starSize).toBe(50); 

    component.maxStars = 12;
    component.calculateStarSize();
    expect(component.starSize).toBe(30); 
  });

  it('should convert rating to percentage correctly', () => {
    component.maxStars = 5;
    expect(component.ratingToPercentage(1)).toBe(0);
    expect(component.ratingToPercentage(3)).toBe(50);
    expect(component.ratingToPercentage(5)).toBe(100);

    component.maxStars = 1;
    expect(component.ratingToPercentage(0)).toBe(0);
    expect(component.ratingToPercentage(1)).toBe(100);
  });

  it('should convert percentage to rating correctly', () => {
    component.maxStars = 5;
    expect(component.percentageToRating(0)).toBe(0);
    expect(component.percentageToRating(50)).toBe(3);
    expect(component.percentageToRating(100)).toBe(5);

    component.maxStars = 1;
    expect(component.percentageToRating(0)).toBe(0);
    expect(component.percentageToRating(100)).toBe(1);
  });
});