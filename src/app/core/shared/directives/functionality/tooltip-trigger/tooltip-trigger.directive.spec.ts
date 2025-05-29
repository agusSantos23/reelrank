import { Component, DebugElement, EventEmitter } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TooltipTriggerDirective } from './tooltip-trigger.directive';
import { ComponentRef } from '@angular/core';

@Component({
  selector: 'app-tooltip',
  template: `<div class="mock-tooltip" [style.top]="positionStyles.top" [style.left]="positionStyles.left">{{ text }}</div>`,
  standalone: true
})
class MockTooltipComponent {
  text: string = '';
  positionStyles: any = {};
}

@Component({
  template: `
    <div id="host-bottom" appTooltipTrigger="Bottom tooltip text" tooltipPosition="bottom" style="width: 50px; height: 20px;">Host Bottom</div>
    <div id="host-top" appTooltipTrigger="Top tooltip text" tooltipPosition="top" style="width: 50px; height: 20px;">Host Top</div>
    <div id="host-left" appTooltipTrigger="Left tooltip text" tooltipPosition="left" style="width: 50px; height: 20px;">Host Left</div>
    <div id="host-right" appTooltipTrigger="Right tooltip text" tooltipPosition="right" style="width: 50px; height: 20px;">Host Right</div>
    <div id="host-dynamic" [appTooltipTrigger]="dynamicText" tooltipPosition="bottom" style="width: 50px; height: 20px;">Host Dynamic</div>
    <div id="host-empty" appTooltipTrigger="" tooltipPosition="bottom" style="width: 50px; height: 20px;">Host Empty</div>
  `
})
class TestComponent {
  dynamicText: string = 'Initial dynamic text';
}

describe('TooltipTriggerDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let hostBottomDebugElement: DebugElement;
  let hostTopDebugElement: DebugElement;
  let hostLeftDebugElement: DebugElement;
  let hostRightDebugElement: DebugElement;
  let hostDynamicDebugElement: DebugElement;
  let hostEmptyDebugElement: DebugElement;

  let createComponentSpy: jasmine.Spy;
  let destroySpy: jasmine.Spy;
  let setPositionSpy: jasmine.Spy;
  let mockTooltipComponentRef: ComponentRef<MockTooltipComponent>;

  beforeEach(() => {
    mockTooltipComponentRef = {
      instance: new MockTooltipComponent(),
      hostView: {
        rootNodes: [{ getBoundingClientRect: () => ({ width: 100, height: 20, top: 0, left: 0, right: 0, bottom: 0 }) }]
      } as any,
      destroy: () => {},
      changeDetectorRef: {} as any,
      location: {} as any,
      setInput: (inputName, value) => {},
      injector: {} as any,
      componentType: MockTooltipComponent,
      onDestroy: (callback: Function) => {}
    };

    TestBed.configureTestingModule({
      imports: [TooltipTriggerDirective, TestComponent],
      providers: []
    });
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    hostBottomDebugElement = fixture.debugElement.query(By.css('#host-bottom'));
    hostTopDebugElement = fixture.debugElement.query(By.css('#host-top'));
    hostLeftDebugElement = fixture.debugElement.query(By.css('#host-left'));
    hostRightDebugElement = fixture.debugElement.query(By.css('#host-right'));
    hostDynamicDebugElement = fixture.debugElement.query(By.css('#host-dynamic'));
    hostEmptyDebugElement = fixture.debugElement.query(By.css('#host-empty'));

    const directiveInstance = hostBottomDebugElement.injector.get(TooltipTriggerDirective);
    createComponentSpy = spyOn((directiveInstance as any)['viewContainerRef'], 'createComponent').and.returnValue(mockTooltipComponentRef);
    destroySpy = spyOn(mockTooltipComponentRef, 'destroy');
    setPositionSpy = spyOn(directiveInstance as any, 'setPosition');

    spyOnProperty(window, 'scrollY', 'get').and.returnValue(0);
    spyOnProperty(document.documentElement, 'scrollTop', 'get').and.returnValue(0);
    spyOnProperty(window, 'scrollX', 'get').and.returnValue(0);
    spyOnProperty(document.documentElement, 'scrollLeft', 'get').and.returnValue(0);
  });

  it('should create an instance', () => {
    expect(hostBottomDebugElement.injector.get(TooltipTriggerDirective)).toBeTruthy();
  });

  it('should show tooltip on mouseenter if not already shown', () => {
    hostBottomDebugElement.triggerEventHandler('mouseenter', null);
    expect(createComponentSpy).toHaveBeenCalledWith(MockTooltipComponent);
    expect(mockTooltipComponentRef.instance.text).toBe('Bottom tooltip text');
    expect(setPositionSpy).toHaveBeenCalled();
  });

  it('should not show tooltip on mouseenter if already shown', () => {
    const directiveInstance = hostBottomDebugElement.injector.get(TooltipTriggerDirective);
    (directiveInstance as any)['tooltipComponentRef'] = mockTooltipComponentRef;
    hostBottomDebugElement.triggerEventHandler('mouseenter', null);
    expect(createComponentSpy).not.toHaveBeenCalled();
  });

  it('should hide tooltip on mouseleave if shown', () => {
    const directiveInstance = hostBottomDebugElement.injector.get(TooltipTriggerDirective);
    (directiveInstance as any)['tooltipComponentRef'] = mockTooltipComponentRef;
    hostBottomDebugElement.triggerEventHandler('mouseleave', null);
    expect(destroySpy).toHaveBeenCalled();
    expect((directiveInstance as any)['tooltipComponentRef']).toBeNull();
  });

  it('should not hide tooltip on mouseleave if not shown', () => {
    hostBottomDebugElement.triggerEventHandler('mouseleave', null);
    expect(destroySpy).not.toHaveBeenCalled();
  });

  it('should update tooltip text on ngOnChanges if tooltip is already shown', () => {
    const directiveInstance = hostDynamicDebugElement.injector.get(TooltipTriggerDirective);
    (directiveInstance as any)['tooltipComponentRef'] = mockTooltipComponentRef;

    fixture.componentInstance.dynamicText = 'New dynamic text';
    fixture.detectChanges();

    expect(mockTooltipComponentRef.instance.text).toBe('New dynamic text');
  });

  it('should set position for bottom tooltip', () => {
    const directiveInstance = hostBottomDebugElement.injector.get(TooltipTriggerDirective);
    spyOn(hostBottomDebugElement.nativeElement, 'getBoundingClientRect').and.returnValue({
      top: 100, left: 100, width: 50, height: 20, right: 150, bottom: 120
    });
    setPositionSpy.and.callThrough();

    hostBottomDebugElement.triggerEventHandler('mouseenter', null);

    const expectedTop = 120 + 5;
    const expectedLeft = 100 + (50 - 100) / 2;
    expect(mockTooltipComponentRef.instance.positionStyles.top).toBe(`${expectedTop}px`);
    expect(mockTooltipComponentRef.instance.positionStyles.left).toBe(`${expectedLeft}px`);
  });

  it('should set position for top tooltip', () => {
    const directiveInstance = hostTopDebugElement.injector.get(TooltipTriggerDirective);
    spyOn(hostTopDebugElement.nativeElement, 'getBoundingClientRect').and.returnValue({
      top: 100, left: 100, width: 50, height: 20, right: 150, bottom: 120
    });
    setPositionSpy.and.callThrough();

    hostTopDebugElement.triggerEventHandler('mouseenter', null);

    const expectedTop = 100 - 20 - 5;
    const expectedLeft = 100 + (50 - 100) / 2;
    expect(mockTooltipComponentRef.instance.positionStyles.top).toBe(`${expectedTop}px`);
    expect(mockTooltipComponentRef.instance.positionStyles.left).toBe(`${expectedLeft}px`);
  });

  it('should set position for left tooltip', () => {
    const directiveInstance = hostLeftDebugElement.injector.get(TooltipTriggerDirective);
    spyOn(hostLeftDebugElement.nativeElement, 'getBoundingClientRect').and.returnValue({
      top: 100, left: 100, width: 50, height: 20, right: 150, bottom: 120
    });
    setPositionSpy.and.callThrough();

    hostLeftDebugElement.triggerEventHandler('mouseenter', null);

    const expectedTop = 100 + (20 - 20) / 2;
    const expectedLeft = 100 - 100 - 5;
    expect(mockTooltipComponentRef.instance.positionStyles.top).toBe(`${expectedTop}px`);
    expect(mockTooltipComponentRef.instance.positionStyles.left).toBe(`${expectedLeft}px`);
  });

  it('should set position for right tooltip', () => {
    const directiveInstance = hostRightDebugElement.injector.get(TooltipTriggerDirective);
    spyOn(hostRightDebugElement.nativeElement, 'getBoundingClientRect').and.returnValue({
      top: 100, left: 100, width: 50, height: 20, right: 150, bottom: 120
    });
    setPositionSpy.and.callThrough();

    hostRightDebugElement.triggerEventHandler('mouseenter', null);

    const expectedTop = 100 + (20 - 20) / 2;
    const expectedLeft = 150 + 5;
    expect(mockTooltipComponentRef.instance.positionStyles.top).toBe(`${expectedTop}px`);
    expect(mockTooltipComponentRef.instance.positionStyles.left).toBe(`${expectedLeft}px`);
  });

  it('should warn if setPosition is called without tooltipComponentRef', () => {
    const directiveInstance = hostBottomDebugElement.injector.get(TooltipTriggerDirective);
    (directiveInstance as any)['tooltipComponentRef'] = null;
    spyOn(console, 'warn');
    (directiveInstance as any)['setPosition']();
    expect(console.warn).toHaveBeenCalledWith('No tooltip component');
  });

  it('should create tooltip if tooltipText is empty on mouseenter', () => {
    hostEmptyDebugElement.triggerEventHandler('mouseenter', null);
    expect(createComponentSpy).toHaveBeenCalledWith(MockTooltipComponent);
    expect(mockTooltipComponentRef.instance.text).toBe('');
    expect(setPositionSpy).toHaveBeenCalled();
  });
});