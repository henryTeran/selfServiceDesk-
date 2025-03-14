import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Orderpage } from './order-page';

describe('Orderpage', () => {
  let component: Orderpage;
  let fixture: ComponentFixture<Orderpage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Orderpage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Orderpage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
