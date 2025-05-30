import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpwardComponent } from './upward.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('UpwardComponent', () => {
  let component: UpwardComponent;
  let fixture: ComponentFixture<UpwardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpwardComponent, NoopAnimationsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(UpwardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should hide button initially', () => {
    expect(component.showButton).toBeFalse();
  });

  it('should show button when scrollY is greater than scrollOffset', () => {
    component.scrollOffset = 100;
    Object.defineProperty(window, 'scrollY', { value: 150, writable: true });
    component.onWindowScroll();
    expect(component.showButton).toBeTrue();
  });

  it('should hide button when scrollY is less than or equal to scrollOffset', () => {
    component.scrollOffset = 100;
    Object.defineProperty(window, 'scrollY', { value: 50, writable: true });
    component.onWindowScroll();
    expect(component.showButton).toBeFalse();

    Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
    component.onWindowScroll();
    expect(component.showButton).toBeFalse();
  });

  it('should scroll to top when scrollToTop is called', () => {
    spyOn(window, 'scrollTo');
    component.scrollToTop();
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });
});