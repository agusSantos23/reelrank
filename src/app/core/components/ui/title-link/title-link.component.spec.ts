import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TitleLinkComponent } from './title-link.component';
import { By } from '@angular/platform-browser';

describe('TitleLinkComponent', () => {
  let component: TitleLinkComponent;
  let fixture: ComponentFixture<TitleLinkComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TitleLinkComponent, RouterTestingModule.withRoutes([])], 
    }).compileComponents();

    fixture = TestBed.createComponent(TitleLinkComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges(); 
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display REELRANK and namePage in uppercase', () => {
    component.namePage = 'home';
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('REELRANK');
    expect(compiled.querySelector('h2').textContent).toContain('HOME');
  });

  it('should adjust span width based on namePage length', () => {
    component.namePage = 'short';
    fixture.detectChanges();
    const spanElement: HTMLElement = fixture.debugElement.query(By.css('span')).nativeElement;

    expect(spanElement.style.width).toBeDefined();

    component.namePage = 'averylongpagename';
    fixture.detectChanges();
    const newSpanElement: HTMLElement = fixture.debugElement.query(By.css('span')).nativeElement;

    const expectedWidth = 220 + (component.namePage.length * 15);
    expect(newSpanElement.style.width).toBe(`${expectedWidth}px`);
  });

  it('should not display dataLink div if dataLink is not provided', () => {
    component.dataLink = undefined;
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('div h3')).toBeNull();
  });

  it('should display dataLink div and uppercase name if dataLink is provided', () => {
    component.dataLink = { name: 'movies', link: '/movies' };
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    const h3Element: HTMLHeadingElement = compiled.querySelector('div h3');
    expect(h3Element).toBeTruthy();
    expect(h3Element.textContent).toContain('GO MOVIES'); 
  });

  it('should navigate to dataLink.link on onGoTo() call', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.dataLink = { name: 'series', link: '/series' };
    fixture.detectChanges();

    const h3Element = fixture.debugElement.query(By.css('h3')).nativeElement;
    h3Element.click(); 

    expect(navigateSpy).toHaveBeenCalledOnceWith(['/series']);
  });

  it('should not navigate if dataLink is not provided when onGoTo() is called', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.dataLink = undefined;
    fixture.detectChanges();

    const headerDiv = fixture.debugElement.query(By.css('header')).nativeElement;
    headerDiv.click(); 

    expect(navigateSpy).not.toHaveBeenCalled();
  });
});