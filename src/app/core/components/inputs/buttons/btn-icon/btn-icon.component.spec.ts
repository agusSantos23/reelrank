import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BtnIconComponent } from './btn-icon.component';

describe('BtnIconComponent', () => {
  let component: BtnIconComponent;
  let fixture: ComponentFixture<BtnIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BtnIconComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(BtnIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set initial sizeContent based on default size', () => {
    expect(component.sizeContent).toBe(30);
  });

  it('should set sizeContent based on input size', () => {
    component.size = 50;
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.sizeContent).toBe(40);
  });

  it('should emit click event when button is clicked and not disabled', () => {
    spyOn(component.clicked, 'emit');
    const button = fixture.nativeElement.querySelector('button');
    button.click();
    expect(component.clicked.emit).toHaveBeenCalled();
  });

  it('should not emit click event when button is disabled', () => {
    spyOn(component.clicked, 'emit');
    component.isDisable = true;
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');
    button.click();
    expect(component.clicked.emit).not.toHaveBeenCalled();
  });

  it('should apply "not-allowed" cursor when disabled', () => {
    component.isDisable = true;
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');
    expect(button.style.cursor).toBe('not-allowed');
  });

  it('should apply "pointer" cursor when not disabled', () => {
    component.isDisable = false;
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');
    expect(button.style.cursor).toBe('pointer');
  });
});