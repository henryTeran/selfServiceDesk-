import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoiseOrderPageComponent } from './choise-order-page.component';

describe('ChoiseOrderPageComponent', () => {
  let component: ChoiseOrderPageComponent;
  let fixture: ComponentFixture<ChoiseOrderPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChoiseOrderPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChoiseOrderPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
