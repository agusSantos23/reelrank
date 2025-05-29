import { Component, DebugElement } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ClickOutSideDirective } from './click-out-side.directive';

@Component({
  template: `
    <div id="hostElement" appClickOutSide (clickOutside)="onOutsideClick()">
      <p>Inside Host Element</p>
      <button>Click Me</button>
    </div>
    <div id="outsideElement">
      <p>Outside Host Element</p>
    </div>
    <button id="anotherOutsideButton">Another Outside Button</button>
  `
})
class TestComponent {
  outsideClicked = false;

  onOutsideClick(): void {
    this.outsideClicked = true;
  }
}

describe('ClickOutSideDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let hostDebugElement: DebugElement;
  let directiveInstance: ClickOutSideDirective;
  let onOutsideClickSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, ClickOutSideDirective]
    });
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    hostDebugElement = fixture.debugElement.query(By.directive(ClickOutSideDirective));
    directiveInstance = hostDebugElement.injector.get(ClickOutSideDirective);
    onOutsideClickSpy = spyOn(fixture.componentInstance, 'onOutsideClick').and.callThrough();
  });

  it('should create an instance', () => {
    expect(directiveInstance).toBeTruthy();
  });

  it('should not emit clickOutside when clicking inside the host element', () => {
    const insideParagraph = hostDebugElement.query(By.css('p')).nativeElement;
    insideParagraph.click();
    fixture.detectChanges();
    expect(onOutsideClickSpy).not.toHaveBeenCalled();
    expect(fixture.componentInstance.outsideClicked).toBeFalse();
  });

  it('should not emit clickOutside when clicking on a child element of the host', () => {
    const insideButton = hostDebugElement.query(By.css('button')).nativeElement;
    insideButton.click();
    fixture.detectChanges();
    expect(onOutsideClickSpy).not.toHaveBeenCalled();
    expect(fixture.componentInstance.outsideClicked).toBeFalse();
  });

  it('should emit clickOutside when clicking outside the host element', () => {
    const outsideElement = fixture.debugElement.query(By.css('#outsideElement')).nativeElement;
    outsideElement.click();
    fixture.detectChanges();
    expect(onOutsideClickSpy).toHaveBeenCalledTimes(1);
    expect(fixture.componentInstance.outsideClicked).toBeTrue();
  });

  it('should emit clickOutside when clicking on another outside element', () => {
    const anotherOutsideButton = fixture.debugElement.query(By.css('#anotherOutsideButton')).nativeElement;
    anotherOutsideButton.click();
    fixture.detectChanges();
    expect(onOutsideClickSpy).toHaveBeenCalledTimes(1);
    expect(fixture.componentInstance.outsideClicked).toBeTrue();
  });

  it('should reset outsideClicked status for subsequent clicks', () => {
    const outsideElement = fixture.debugElement.query(By.css('#outsideElement')).nativeElement;
    const insideParagraph = hostDebugElement.query(By.css('p')).nativeElement;

    outsideElement.click();
    fixture.detectChanges();
    expect(onOutsideClickSpy).toHaveBeenCalledTimes(1);
    expect(fixture.componentInstance.outsideClicked).toBeTrue();

    fixture.componentInstance.outsideClicked = false;
    onOutsideClickSpy.calls.reset();

    insideParagraph.click();
    fixture.detectChanges();
    expect(onOutsideClickSpy).not.toHaveBeenCalled();
    expect(fixture.componentInstance.outsideClicked).toBeFalse();

    fixture.componentInstance.outsideClicked = false;
    onOutsideClickSpy.calls.reset();

    outsideElement.click();
    fixture.detectChanges();
    expect(onOutsideClickSpy).toHaveBeenCalledTimes(1);
    expect(fixture.componentInstance.outsideClicked).toBeTrue();
  });
});