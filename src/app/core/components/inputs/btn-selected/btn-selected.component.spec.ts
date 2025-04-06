import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnSelectedComponent } from './btn-selected.component';

describe('BtnSelectedComponent', () => {
  let component: BtnSelectedComponent;
  let fixture: ComponentFixture<BtnSelectedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BtnSelectedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BtnSelectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
