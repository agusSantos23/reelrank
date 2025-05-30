import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BtnAuthComponent } from './btn-auth.component';
import { Router } from '@angular/router';

describe('BtnAuthComponent', () => {
  let component: BtnAuthComponent;
  let fixture: ComponentFixture<BtnAuthComponent>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [BtnAuthComponent],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BtnAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to /auth/login on button click', () => {
    component.onAuthClick();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth/login']);
  });

  it('should display SVG when type is not "center"', () => {
    component.type = 'start';
    fixture.detectChanges();
    const svgElement = fixture.nativeElement.querySelector('svg');
    expect(svgElement).toBeTruthy();
  });

  it('should not display SVG when type is "center"', () => {
    component.type = 'center';
    fixture.detectChanges();
    const svgElement = fixture.nativeElement.querySelector('svg');
    expect(svgElement).toBeFalsy();
  });
});