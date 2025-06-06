import { Component, Input, Output, EventEmitter, Renderer2, OnDestroy, OnInit, inject } from '@angular/core';
import { SelectOption } from '../../../models/SelectOption.model';

@Component({
  selector: 'app-select',
  imports: [],
  templateUrl: './select.component.html',
  styleUrl: './select.component.css'
})
export class SelectComponent implements OnDestroy, OnInit {
  private renderer = inject(Renderer2)

  @Input() defaultComponent: boolean = true;
  @Input() options: SelectOption[] = [];
  @Output() selectionChange = new EventEmitter<any>();

  public default!: SelectOption;
  public selectedValue!: string;
  public isOpen: boolean = false;


  ngOnInit() {
    
    if (this.options && this.options.length > 0) {
      this.default = this.options[0];
      this.selectedValue = this.default.value;
    } else {
      this.default = { value: '', label: 'Seleccionar' };
      this.selectedValue = '';
    }
  }

  ngOnDestroy() {
    if (this.clickListener) this.clickListener();
  }

  public toggleOpen() {
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

  public selectOption(option: SelectOption) {
    this.selectedValue = option.value;
    this.selectionChange.emit(this.selectedValue);
    this.isOpen = false;
  }

  get filteredOptions() {
    return this.options.filter((option) => option.value !== this.selectedValue);
  }

  public getSelectedLabel(): string {
    const selectedOption = this.options.find((option) => option.value === this.selectedValue);
    return selectedOption ? selectedOption.label : this.default.label;
  }


  public clickListener: (() => void) | null = null;



}