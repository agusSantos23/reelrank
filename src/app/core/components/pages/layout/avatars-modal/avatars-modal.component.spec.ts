import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarsModalComponent } from './avatars-modal.component';

describe('AvatarsModalComponent', () => {
  let component: AvatarsModalComponent;
  let fixture: ComponentFixture<AvatarsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvatarsModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvatarsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
