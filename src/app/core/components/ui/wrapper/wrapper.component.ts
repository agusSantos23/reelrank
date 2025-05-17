import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-wrapper',
  imports: [],
  template: `
    <div
      (click)="onWrapperClick()"
      [attr.role]="type === 'btn' ? 'button' : null"
      [attr.tabindex]="type === 'btn' ? 0 : null"
      (keydown.enter)="type === 'btn' ? onWrapperClick() : null"
      (keydown.space)="type === 'btn' ? onWrapperClick() : null"
      [style.minWidth]="width"
      [style.minHeight]="height"
      [style.cursor]="cursorType(this.cursor)"
      [style.padding.px]="containerPading"
      [style.borderRadius.px]="borderRadius"
      [class.black-container]="containerColor === 'b'"
      [class.gradient-container]="containerColor === 'g'"
      [class.error-container]="containerColor === 'e'"
      [class.zoom]="animation === 'zoom'"
      [@activeAnimation]="isActive === true ? 'active' : (isActive === false ? 'inactive' : null)">
      
      <div
        [style.justifyContent]="flex?.[0] ?? 'center'"
        [style.gap]="flex?.[1] ?? '0'"
        [class.flex-content]="flex"
        [style.cursor]="cursorType(this.cursor)"
        [style.fontSize]="fontSize"
        [style.fontWeight]="fontWeight"
        [style.textAlign]="textAlign"
        [style.letterSpacing]="letterSpacing"
        [style.paddingLeft.px]="paddingLeft"
        [style.paddingRight.px]="paddingRight"
        [style.paddingTop.px]="paddingTop"
        [style.paddingBottom.px]="paddingBottom"
        [style.borderRadius.px]="borderRadius"
        [class.white-content]="!(cursor === 'di')"
        [class.white-disabled-content]="cursor === 'di'"
        [@contentScale]="isActive ? 'scaled' : 'normal'">

        <ng-content />

      </div>

    </div>
  `,
  styleUrl: './wrapper.component.css',
  animations: [
    trigger('activeAnimation', [
      state('inactive', style({ background: 'var(--black)' })),
      state('active', style({ background: 'var(--gradient)' })),
      transition('inactive <=> active', animate('200ms ease-in-out'))
    ]),

    trigger('contentScale', [
      state('scaled', style({ transform: 'scale(0.95)' })),
      transition('normal <=> scaled', animate('200ms ease-in-out'))
    ])

  ]
})
export class WrapperComponent implements OnInit {
  @Input() track: any;
  @Input() type: 'text' | 'btn' = 'text';
  @Input() isActive?: boolean;

  @Input() width: string = 'auto';
  @Input() height: string = 'auto';
  @Input() containerPading: number = 5;
  @Input() contentPading: number | [number, number] = 10;
  @Input() borderRadius: number = 5;
  @Input() containerColor: 'b' | 'g' | 'e' = 'b';
  @Input() cursor: 'po' | 'di' | 'de' = 'de';
  @Input() flex?: ['center' | 'start' | 'end', string];
  @Input() contentText: [string | number | undefined, string | undefined, 'center' | 'right' | 'left' | undefined, string | undefined] = [undefined, undefined, undefined, undefined];
  @Input() animation?: 'zoom';
  @Output() wrapperClick: EventEmitter<any> = new EventEmitter<any>();

  protected fontWeight: string | number = 'normal';
  protected letterSpacing: string = 'normal';
  protected textAlign: 'center' | 'right' | 'left' = 'center';
  protected fontSize: string | undefined;

  protected paddingTop: number = 0;
  protected paddingRight: number = 0;
  protected paddingBottom: number = 0;
  protected paddingLeft: number = 0;

  ngOnInit(): void {    
    
    this.applyContentPadingType();
    this.applyContentTextStyles();
  }

  private applyContentPadingType(): void{
    if (typeof this.contentPading === 'number') {
      this.paddingTop = this.contentPading;
      this.paddingRight = this.contentPading;
      this.paddingBottom = this.contentPading;
      this.paddingLeft = this.contentPading;

    } else if (Array.isArray(this.contentPading) && this.contentPading.length === 2) {

      this.paddingTop = this.contentPading[1];
      this.paddingRight = this.contentPading[0];
      this.paddingBottom = this.contentPading[1];
      this.paddingLeft = this.contentPading[0];

    } else {
      console.warn('The input "contentPading" must be a number or an array of two numbers.');
      this.paddingTop = 0;
      this.paddingRight = 0;
      this.paddingBottom = 0;
      this.paddingLeft = 0;

    }
  }

  private applyContentTextStyles(): void {
    this.fontWeight = this.contentText[0] !== undefined ? this.contentText[0] : 'normal';
    this.letterSpacing = this.contentText[1] !== undefined ? this.contentText[1] : 'normal';
    this.textAlign = this.contentText[2] !== undefined ? this.contentText[2] : 'center';
    this.fontSize = this.contentText[3] !== undefined ? this.contentText[3] : '16px';

  }

  protected cursorType(type: string): string{

    switch(type){
      case 'po':        
        return 'pointer'

      case 'di':
        return 'not-allowed'

      default:
        return 'default'
    }
  }

  protected onWrapperClick(): void {
    
    this.track !== undefined 
      ?this.wrapperClick.emit(this.track)
      :this.wrapperClick.emit()
  
  }

}
