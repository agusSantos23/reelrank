import { Component, DebugElement } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FocusInputDirective } from './focus-input.directive';

@Component({
  template: `
    <div id="hostWithInput" appFocusInput>
      <input type="text" id="targetInput1">
      <p>Some text</p>
    </div>
    <div id="hostWithoutInput" appFocusInput>
      <p>No input here</p>
    </div>
    <div id="hostWithMultipleInputs" appFocusInput>
      <input type="text" id="targetInput2">
      <input type="text" id="anotherInput">
    </div>
  `
})
class TestComponent { }

describe('FocusInputDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let hostWithInputDebugElement: DebugElement;
  let hostWithoutInputDebugElement: DebugElement;
  let hostWithMultipleInputsDebugElement: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, FocusInputDirective]
    });
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    hostWithInputDebugElement = fixture.debugElement.query(By.css('#hostWithInput'));
    hostWithoutInputDebugElement = fixture.debugElement.query(By.css('#hostWithoutInput'));
    hostWithMultipleInputsDebugElement = fixture.debugElement.query(By.css('#hostWithMultipleInputs'));
  });

  it('should create an instance', () => {
    const directiveInstance = hostWithInputDebugElement.injector.get(FocusInputDirective);
    expect(directiveInstance).toBeTruthy();
  });

  it('should focus the first input element on host click', () => {
    const inputElement: HTMLInputElement = hostWithInputDebugElement.query(By.css('input')).nativeElement;
    spyOn(inputElement, 'focus');

    hostWithInputDebugElement.nativeElement.click();
    expect(inputElement.focus).toHaveBeenCalled();
  });

  it('should not throw error if no input element is found within the host', () => {
    spyOn(console, 'warn');
    expect(console.warn).toHaveBeenCalledWith(
      'The Appfocusinputonck directive needs an input element within its host.',
      hostWithoutInputDebugElement.nativeElement
    );
    expect(() => hostWithoutInputDebugElement.nativeElement.click()).not.toThrow();
  });

  it('should set cursor to text on mouseenter', () => {
    const hostElement: HTMLElement = hostWithInputDebugElement.nativeElement;
    hostElement.dispatchEvent(new Event('mouseenter'));
    fixture.detectChanges();
    expect(hostElement.style.cursor).toBe('text');
  });

  it('should set cursor to default on mouseleave', () => {
    const hostElement: HTMLElement = hostWithInputDebugElement.nativeElement;
    hostElement.dispatchEvent(new Event('mouseenter'));
    fixture.detectChanges();
    expect(hostElement.style.cursor).toBe('text');

    hostElement.dispatchEvent(new Event('mouseleave'));
    fixture.detectChanges();
    expect(hostElement.style.cursor).toBe('default');
  });

  it('should focus the first input if multiple inputs are present', () => {
    const firstInput: HTMLInputElement = hostWithMultipleInputsDebugElement.query(By.css('#targetInput2')).nativeElement;
    const secondInput: HTMLInputElement = hostWithMultipleInputsDebugElement.query(By.css('#anotherInput')).nativeElement;
    spyOn(firstInput, 'focus');
    spyOn(secondInput, 'focus');

    hostWithMultipleInputsDebugElement.nativeElement.click();
    expect(firstInput.focus).toHaveBeenCalled();
    expect(secondInput.focus).not.toHaveBeenCalled();
  });
});