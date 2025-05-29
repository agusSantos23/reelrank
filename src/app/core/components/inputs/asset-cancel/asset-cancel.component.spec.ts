import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssetCancelComponent } from './asset-cancel.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('AssetCancelComponent', () => {
  let component: AssetCancelComponent;
  let fixture: ComponentFixture<AssetCancelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetCancelComponent, NoopAnimationsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetCancelComponent);
    component = fixture.componentInstance;
    component.data = { id: 'test-id', name: 'Test Name' }; 
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display data name in uppercase', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('div')?.textContent).toContain('TEST NAME');
  });

  it('should emit data id on cancel click', () => {
    spyOn(component.cancelEmitter, 'emit');
    const button = fixture.nativeElement.querySelector('button');
    button.click();
    expect(component.cancelEmitter.emit).toHaveBeenCalledWith('test-id');
  });

  it('should set animationState to "hovered" on mouse enter', () => {
    const button = fixture.nativeElement.querySelector('button');
    button.dispatchEvent(new Event('mouseenter'));
    fixture.detectChanges();
    expect(component.animationState).toBe('hovered');
  });

  it('should set animationState to "initial" on mouse leave', () => {
    component.onMouseEnter(); 
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    button.dispatchEvent(new Event('mouseleave'));
    fixture.detectChanges();
    expect(component.animationState).toBe('initial');
  });
});