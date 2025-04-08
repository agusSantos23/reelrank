import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnAuthComponent } from './btn-auth.component';

describe('BtnAuthComponent', () => {
  let component: BtnAuthComponent;
  let fixture: ComponentFixture<BtnAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BtnAuthComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BtnAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
