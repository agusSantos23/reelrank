import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetCancelComponent } from './asset-cancel.component';

describe('AssetCancelComponent', () => {
  let component: AssetCancelComponent;
  let fixture: ComponentFixture<AssetCancelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetCancelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetCancelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
