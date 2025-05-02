import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TitleAuthComponent } from './title-link.component';

describe('TitleAuthComponent', () => {
  let component: TitleAuthComponent;
  let fixture: ComponentFixture<TitleAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TitleAuthComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TitleAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
