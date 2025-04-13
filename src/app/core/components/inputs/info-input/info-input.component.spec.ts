import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoInputComponent } from './info-input.component';

describe('InfoInputComponent', () => {
  let component: InfoInputComponent;
  let fixture: ComponentFixture<InfoInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
