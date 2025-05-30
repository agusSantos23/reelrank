import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OptionsSliderComponent } from './options-slider.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('OptionsSliderComponent', () => {
  let component: OptionsSliderComponent;
  let fixture: ComponentFixture<OptionsSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OptionsSliderComponent, NoopAnimationsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(OptionsSliderComponent);
    component = fixture.componentInstance;
    component.options = [{ id: 1, name: 'Option 1' }, { id: 2, name: 'Option 2' }];
    fixture.detectChanges();

    if (!component.container) {
      component.container = { nativeElement: { offsetLeft: 0, scrollLeft: 0, style: { cursor: '' } } } as any;
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit option when selected and not dragging', () => {
    spyOn(component.optionEmitter, 'emit');
    component.hasMoved = false;
    const testOption = { id: 1, name: 'Option 1' };
    component.selectedOption(testOption);
    expect(component.optionEmitter.emit).toHaveBeenCalledWith(testOption);
  });

  it('should not emit option when selected and dragging occurred', () => {
    spyOn(component.optionEmitter, 'emit');
    component.hasMoved = true;
    const testOption = { id: 1, name: 'Option 1' };
    component.selectedOption(testOption);
    expect(component.optionEmitter.emit).not.toHaveBeenCalled();
  });

  it('should set isDragging to true and hasMoved to false on mousedown', () => {
    const mouseEvent = new MouseEvent('mousedown');
    Object.defineProperty(mouseEvent, 'pageX', { value: 100 });
    
    component.onMouseDown(mouseEvent);
    expect(component.isDragging).toBeTrue();
    expect(component.hasMoved).toBeFalse();
    expect(component.startX).toBeDefined();
    expect(component.scrollLeft).toBeDefined();
  });

  it('should set hasMoved to true and update scrollLeft on mousemove when dragging', () => {
    component.isDragging = true;
    component.startX = 100;
    component.scrollLeft = 0;
    fixture.detectChanges();

    const mouseEvent = new MouseEvent('mousemove');
    Object.defineProperty(mouseEvent, 'pageX', { value: 150 });
    
    component.onMouseMove(mouseEvent);
    expect(component.hasMoved).toBeTrue();
  });

  it('should set isDragging to false and reset hasMoved on mouseup', (done) => {
    component.isDragging = true;
    component.onMouseUp();
    expect(component.isDragging).toBeFalse();

    setTimeout(() => {
      expect(component.hasMoved).toBeFalse();
      done();
    }, 200);
  });

  it('should reset isDragging and hasMoved on window mouseup', () => {
    component.isDragging = true;
    
    const mouseEvent = new MouseEvent('mouseup');
    component.onMouseUpWindow(mouseEvent);
    expect(component.isDragging).toBeFalse();
    expect(component.hasMoved).toBeFalse();
  });
});