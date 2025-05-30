import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewInputComponent } from './view-input.component';

describe('ViewInputComponent', () => {
  let component: ViewInputComponent;
  let fixture: ComponentFixture<ViewInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewInputComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set isView to true and emit true when onClick is called and isView is false', () => {
    spyOn(component.stateView, 'emit');
    component.isView = false;
    component.onClick();
    expect(component.isView).toBeTrue();
    expect(component.stateView.emit).toHaveBeenCalledWith(true);
  });

  it('should set isView to false and emit false when onClick is called and isView is true', () => {
    spyOn(component.stateView, 'emit');
    component.isView = true;
    component.onClick();
    expect(component.isView).toBeFalse();
    expect(component.stateView.emit).toHaveBeenCalledWith(false);
  });

  it('should display the "hide" SVG when isView is true', () => {
    component.isView = true;
    fixture.detectChanges();
    const svgPaths = fixture.nativeElement.querySelectorAll('svg path');
    expect(svgPaths[1].getAttribute('d')).toContain('M8.71 13.65');
  });

  it('should display the "show" SVG when isView is false', () => {
    component.isView = false;
    fixture.detectChanges();
    const svgPaths = fixture.nativeElement.querySelectorAll('svg path');
    expect(svgPaths[1].getAttribute('d')).toContain('M12 15.5a3.5 3.5 0 1 0 0-7a3.5 3.5 0 0 0 0 7');
  });

  it('should call onClick when the SVG is clicked', () => {
    spyOn(component, 'onClick');
    const svgElement = fixture.nativeElement.querySelector('svg');
    svgElement.click();
    expect(component.onClick).toHaveBeenCalled();
  });
});