import { Component, DebugElement } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FloatingLabelDirective } from './floating-label.directive';

@Component({
  template: `
    <div>
      <label id="testLabel">Test Label</label>
      <input type="text" [appFloatingLabel]="'testLabel'">
    </div>
    <div>
      <label id="anotherLabel">Another Label</label>
      <input type="text" [appFloatingLabel]="'anotherLabel'">
    </div>
    <div>
      <label id="missingLabel">Missing Label</label>
      <input type="text" [appFloatingLabel]="'nonExistentLabelId'">
    </div>
  `
})
class TestComponent { }

describe('FloatingLabelDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let debugElements: DebugElement[];
  let inputElements: HTMLInputElement[];
  let labelElements: HTMLElement[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, FloatingLabelDirective]
    });
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    debugElements = fixture.debugElement.queryAll(By.directive(FloatingLabelDirective));
    inputElements = debugElements.map(de => de.nativeElement);
    labelElements = debugElements.map(de => de.nativeElement.parentElement.querySelector('label'));
  });

  it('should create an instance', () => {
    expect(debugElements.length).toBeGreaterThan(0);
    expect(debugElements[0].injector.get(FloatingLabelDirective)).toBeTruthy();
  });

  it('should initially apply label-float-down if input is empty', () => {
    const inputEl = inputElements[0];
    const labelEl = labelElements[0];
    expect(inputEl.value).toBe('');
    expect(labelEl.classList.contains('label-float-down')).toBeTrue();
    expect(labelEl.classList.contains('label-float-up')).toBeFalse();
  });

  it('should initially apply label-float-up if input has a value', () => {
    const inputEl = inputElements[1];
    const labelEl = labelElements[1];
    inputEl.value = 'some value';
    fixture.detectChanges();
    inputEl.focus();
    inputEl.blur();
    fixture.detectChanges();

    expect(labelEl.classList.contains('label-float-up')).toBeTrue();
    expect(labelEl.classList.contains('label-float-down')).toBeFalse();
  });

  it('should apply label-float-up on focus', () => {
    const inputEl = inputElements[0];
    const labelEl = labelElements[0];

    inputEl.focus();
    fixture.detectChanges();

    expect(labelEl.classList.contains('label-float-up')).toBeTrue();
    expect(labelEl.classList.contains('label-float-down')).toBeFalse();
  });

  it('should apply label-float-down on blur if input is empty', () => {
    const inputEl = inputElements[0];
    const labelEl = labelElements[0];

    inputEl.focus();
    fixture.detectChanges();
    expect(labelEl.classList.contains('label-float-up')).toBeTrue();

    inputEl.blur();
    fixture.detectChanges();

    expect(labelEl.classList.contains('label-float-down')).toBeTrue();
    expect(labelEl.classList.contains('label-float-up')).toBeFalse();
  });

  it('should apply label-float-up on blur if input has value', () => {
    const inputEl = inputElements[0];
    const labelEl = labelElements[0];

    inputEl.value = 'test';
    inputEl.focus();
    fixture.detectChanges();
    expect(labelEl.classList.contains('label-float-up')).toBeTrue();

    inputEl.blur();
    fixture.detectChanges();

    expect(labelEl.classList.contains('label-float-up')).toBeTrue();
    expect(labelEl.classList.contains('label-float-down')).toBeFalse();
  });

  it('should update label class on input change (typing)', () => {
    const inputEl = inputElements[0];
    const labelEl = labelElements[0];

    inputEl.value = 's';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(labelEl.classList.contains('label-float-up')).toBeTrue();
    expect(labelEl.classList.contains('label-float-down')).toBeFalse();

    inputEl.value = '';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(labelEl.classList.contains('label-float-down')).toBeTrue();
    expect(labelEl.classList.contains('label-float-up')).toBeFalse();
  });

  it('should not throw error if label element is not found', () => {
    const missingLabelInput = fixture.debugElement.query(By.css('input[appFloatingLabel="nonExistentLabelId"]')).nativeElement;
    expect(() => {
      missingLabelInput.focus();
      fixture.detectChanges();
      missingLabelInput.blur();
      fixture.detectChanges();
      missingLabelInput.value = 'x';
      missingLabelInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();
    }).not.toThrow();
  });
});