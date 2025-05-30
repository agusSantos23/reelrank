import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InfoInputComponent } from './info-input.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('InfoInputComponent', () => {
  let component: InfoInputComponent;
  let fixture: ComponentFixture<InfoInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoInputComponent, NoopAnimationsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(InfoInputComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should not modify annotationsText if it has content and isRequired is true', () => {
    component.annotationsText = ['Existing annotation'];
    component.isRequired = true;
    fixture.detectChanges();
    expect(component.annotationsText).toEqual(['Existing annotation']);
  });

  it('should set annotationsText to "Is required" if empty and isRequired is true', () => {
    component.annotationsText = [];
    component.isRequired = true;
    fixture.detectChanges();
    expect(component.annotationsText).toEqual(['Is required']);
  });

  it('should not modify annotationsText if isRequired is false', () => {
    component.annotationsText = [];
    component.isRequired = false;
    fixture.detectChanges();
    expect(component.annotationsText).toEqual([]);
  });

  it('should have onInfo set to false by default', () => {
    fixture.detectChanges();
    expect(component.onInfo).toBeFalse();
  });
});