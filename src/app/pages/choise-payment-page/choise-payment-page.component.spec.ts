import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoisePaymentPageComponent } from './choise-payment-page.component';

describe('ChoisePaymentPageComponent', () => {
  let component: ChoisePaymentPageComponent;
  let fixture: ComponentFixture<ChoisePaymentPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChoisePaymentPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChoisePaymentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
