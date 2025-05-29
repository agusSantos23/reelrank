import { Component, DebugElement } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AdjustFontSizeDirective } from './adjust-font-size.directive';

@Component({
  template: `
    <div
      [appAdjustFontSize]="shortText"
      [longTextThreshold]="70"
      [mediumTextThreshold]="30"
      longTextSize="0.5em"
      mediumTextSize="0.7em"
      defaultTextSize="1.0em"
    >
      {{ shortText }}
    </div>
    <div
      [appAdjustFontSize]="mediumText"
      [longTextThreshold]="70"
      [mediumTextThreshold]="30"
      longTextSize="0.5em"
      mediumTextSize="0.7em"
      defaultTextSize="1.0em"
    >
      {{ mediumText }}
    </div>
    <div
      [appAdjustFontSize]="emptyText"
      [longTextThreshold]="70"
      [mediumTextThreshold]="30"
      longTextSize="0.5em"
      mediumTextSize="0.7em"
      defaultTextSize="1.0em"
    >
      {{ emptyText }}
    </div>
    <div
      [appAdjustFontSize]="dynamicText"
      [longTextThreshold]="70"
      [mediumTextThreshold]="30"
      longTextSize="0.5em"
      mediumTextSize="0.7em"
      defaultTextSize="1.0em"
    >
      {{ dynamicText }}
    </div>
  `
})
class TestComponent {
  shortText = 'Short text.';
  mediumText = 'This is a medium length text that should trigger the medium size.';
  emptyText = '';
  dynamicText = 'Initial text.';
}

describe('AdjustFontSizeDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let debugElements: DebugElement[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AdjustFontSizeDirective, TestComponent] 
    });
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    debugElements = fixture.debugElement.queryAll(By.directive(AdjustFontSizeDirective));
  });

  it('should create an instance', () => {
    expect(debugElements.length).toBeGreaterThan(0);
    expect(debugElements[0].injector.get(AdjustFontSizeDirective)).toBeTruthy();
  });

  it('should apply default size for short text', () => {
    const element = debugElements[0].nativeElement;
    expect(element.style.fontSize).toBe('1em'); 
  });

  it('should apply medium size for medium text', () => {
    const element = debugElements[1].nativeElement;
    expect(element.style.fontSize).toBe('0.7em'); 
  });

  it('should apply long text size for long text', () => {
    const dynamicTextElement = debugElements[3].nativeElement;
    fixture.componentInstance.dynamicText = 'a'.repeat(80);
    fixture.detectChanges();
    expect(dynamicTextElement.style.fontSize).toBe('0.5em'); 
  });

  it('should not apply any font size if text is empty or undefined', () => {
    const emptyTextElement = debugElements[2].nativeElement;
    expect(emptyTextElement.style.fontSize).toBe(''); 
  });

  it('should adjust font size when text input changes (short to medium)', () => {
    const element = debugElements[3].nativeElement; 
    fixture.componentInstance.dynamicText = 'Some text now is longer than 30 chars but less than 70.';
    fixture.detectChanges();
    expect(element.style.fontSize).toBe('0.7em'); 
  });

  it('should adjust font size when text input changes (medium to short)', () => {
    const element = debugElements[3].nativeElement;
    fixture.componentInstance.dynamicText = 'a'.repeat(40); 
    fixture.detectChanges();
    expect(element.style.fontSize).toBe('0.7em');

    fixture.componentInstance.dynamicText = 'Short.'; 
    fixture.detectChanges();
    expect(element.style.fontSize).toBe('1em');
  });

  it('should adjust font size when text input changes (long to short)', () => {
    const element = debugElements[3].nativeElement;
    fixture.componentInstance.dynamicText = 'a'.repeat(80); 
    fixture.detectChanges();
    expect(element.style.fontSize).toBe('0.5em');

    fixture.componentInstance.dynamicText = 'Short.'; 
    fixture.detectChanges();
    expect(element.style.fontSize).toBe('1em');
  });

  it('should handle text with leading/trailing spaces correctly', () => {
    const element = debugElements[3].nativeElement;
    fixture.componentInstance.dynamicText = '   ' + 'a'.repeat(60) + '   '; 
    fixture.detectChanges();
    expect(element.style.fontSize).toBe('0.7em');
  });
});