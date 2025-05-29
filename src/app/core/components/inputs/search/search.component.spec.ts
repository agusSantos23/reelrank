import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchComponent } from './search.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ElementRef } from '@angular/core';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchComponent, NoopAnimationsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set isInputFocused to true on onFocus', () => {
    component.onFocus();
    expect(component.isInputFocused).toBeTrue();
  });

  it('should set isInputFocused to false on onBlur', () => {
    component.onFocus(); 
    component.onBlur();
    expect(component.isInputFocused).toBeFalse();
  });

  it('should emit searchSubmitted with the correct term on search', () => {
    spyOn(component.searchSubmitted, 'emit');
    const searchTerm = 'test movie';
    component.search(searchTerm);
    expect(component.searchSubmitted.emit).toHaveBeenCalledWith(searchTerm);
  });

  it('should blur the search input after search is submitted', () => {
    const mockInput = document.createElement('input');
    spyOn(mockInput, 'blur');
    component.searchInput = new ElementRef(mockInput);
    
    component.search('test');
    expect(mockInput.blur).toHaveBeenCalled();
  });

  it('should not blur if searchInput is undefined', () => {
    component.searchInput = undefined;
    
    component.search('test');

  });

  it('should call onFocus when container is clicked', () => {
    spyOn(component, 'onFocus');
    const container = fixture.nativeElement.querySelector('#container');
    container.click();
    expect(component.onFocus).toHaveBeenCalled();
  });

  it('should call onFocus when input is focused', () => {
    spyOn(component, 'onFocus');
    const input = fixture.nativeElement.querySelector('input');
    input.focus();
    expect(component.onFocus).toHaveBeenCalled();
  });

  it('should call onBlur when input is blurred', () => {
    spyOn(component, 'onBlur');
    const input = fixture.nativeElement.querySelector('input');
    input.focus();
    input.blur();
    expect(component.onBlur).toHaveBeenCalled();
  });

  it('should call search on keyup.enter on input', () => {
    spyOn(component, 'search');
    const input = fixture.nativeElement.querySelector('input');
    input.value = 'movie title';
    input.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
    expect(component.search).toHaveBeenCalledWith('movie title');
  });

  it('should call search on search icon click', () => {
    spyOn(component, 'search');
    const input = fixture.nativeElement.querySelector('input');
    input.value = 'movie title';
    const searchIcon = fixture.nativeElement.querySelector('svg');
    searchIcon.click();
    expect(component.search).toHaveBeenCalledWith('movie title');
  });
});