import { Component, Input, Output, EventEmitter, Renderer2, OnDestroy } from '@angular/core';
import { SelectOption } from '../models/selectOption.model';

@Component({
  selector: 'app-select',
  imports: [],
  templateUrl: './select.component.html',
  styleUrl: './select.component.css'
})
export class SelectComponent implements OnDestroy {
  @Input() default: boolean = true;
  @Input() options: SelectOption[] = [
    { value: 'normal', label: 'ALL MOVIES' },
    { value: 'top', label: 'TOP MOVIES' },
    { value: 'soon', label: 'COMING SOON' }
  ];
  @Output() selectionChange = new EventEmitter<any>();

  selectedValue: string = 'normal';
  isOpen: boolean = false;

  private clickListener: (() => void) | null = null;

  constructor(private renderer: Renderer2) {}



  toggleOpen() {
    this.isOpen = !this.isOpen;

    if (this.isOpen) {
      this.clickListener = this.renderer.listen('document', 'click', (event) => {
        const selectElement = this.renderer.selectRootElement('app-select', true);
        if (!selectElement.contains(event.target)) {
          this.isOpen = false;
          if (this.clickListener) {
            this.clickListener();
            this.clickListener = null;
          }
        }
      });
    } else if (this.clickListener) {
      this.clickListener();
      this.clickListener = null;
    }
  }

  selectOption(option: SelectOption) {
    this.selectedValue = option.value;
    this.selectionChange.emit(this.selectedValue);
    this.isOpen = false;
  }

  get filteredOptions() {
    return this.options.filter((option) => option.value !== this.selectedValue);
  }

  getSelectedLabel(): string {
    const selectedOption = this.options.find(
      (option) => option.value === this.selectedValue
    );
    return selectedOption ? selectedOption.label : 'Default';
  }


  ngOnDestroy() {
    if (this.clickListener) this.clickListener();
  }
}
