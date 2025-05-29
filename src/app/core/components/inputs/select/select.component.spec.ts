import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectComponent } from './select.component';
import { Renderer2 } from '@angular/core';

describe('SelectComponent', () => {
  let component: SelectComponent;
  let fixture: ComponentFixture<SelectComponent>;
  let renderer: Renderer2;
  let mockSelectElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectComponent],
      providers: [Renderer2]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectComponent);
    component = fixture.componentInstance;
    renderer = TestBed.inject(Renderer2);

    mockSelectElement = document.createElement('app-select');
    spyOn(renderer, 'selectRootElement').and.returnValue(mockSelectElement);
  });

  afterEach(() => {
    if (component.ngOnDestroy) {
      component.ngOnDestroy();
    }
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should initialize with first option as default if options exist', () => {
    component.options = [{ value: '1', label: 'Option 1' }, { value: '2', label: 'Option 2' }];
    component.ngOnInit();
    expect(component.default).toEqual({ value: '1', label: 'Option 1' });
    expect(component.selectedValue).toBe('1');
  });

  it('should initialize with empty default if no options', () => {
    component.options = [];
    component.ngOnInit();
    expect(component.default).toEqual({ value: '', label: 'Seleccionar' });
    expect(component.selectedValue).toBe('');
  });

  it('should toggle isOpen to true on first toggleOpen call', () => {
    component.isOpen = false;
    component.toggleOpen();
    expect(component.isOpen).toBeTrue();
  });

  it('should toggle isOpen to false on second toggleOpen call', () => {
    component.isOpen = true;
    component.toggleOpen();
    expect(component.isOpen).toBeFalse();
  });

  it('should close dropdown when clicking outside', () => {
    component.isOpen = true;
    component.toggleOpen(); 

    const outsideClickEvent = new MouseEvent('click');
    spyOn(mockSelectElement, 'contains').and.returnValue(false);
    document.dispatchEvent(outsideClickEvent);

    expect(component.isOpen).toBeFalse();
  });

  it('should not close dropdown when clicking inside', () => {
    component.isOpen = true;
    component.toggleOpen(); 

    const insideClickEvent = new MouseEvent('click');
    spyOn(mockSelectElement, 'contains').and.returnValue(true);
    document.dispatchEvent(insideClickEvent);

    expect(component.isOpen).toBeTrue();
  });

  it('should select an option and emit selectionChange', () => {
    spyOn(component.selectionChange, 'emit');
    const optionToSelect = { value: '2', label: 'Option 2' };
    component.selectOption(optionToSelect);
    expect(component.selectedValue).toBe('2');
    expect(component.selectionChange.emit).toHaveBeenCalledWith('2');
    expect(component.isOpen).toBeFalse();
  });

  it('should filter out the selected option from filteredOptions', () => {
    component.options = [{ value: '1', label: 'Option 1' }, { value: '2', label: 'Option 2' }];
    component.ngOnInit(); 
    expect(component.filteredOptions).toEqual([{ value: '2', label: 'Option 2' }]);

    component.selectOption({ value: '2', label: 'Option 2' });
    expect(component.filteredOptions).toEqual([{ value: '1', label: 'Option 1' }]);
  });

  it('should return selected label', () => {
    component.options = [{ value: '1', label: 'Option 1' }, { value: '2', label: 'Option 2' }];
    component.ngOnInit();
    expect(component.getSelectedLabel()).toBe('Option 1');

    component.selectOption({ value: '2', label: 'Option 2' });
    expect(component.getSelectedLabel()).toBe('Option 2');
  });

  it('should return default label if selectedValue is not found', () => {
    component.options = [{ value: '1', label: 'Option 1' }];
    component.ngOnInit();
    component.selectedValue = 'non-existent';
    expect(component.getSelectedLabel()).toBe('Option 1');
  });
});