import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanPayments } from './loan-payments';

describe('LoanPayments', () => {
  let component: LoanPayments;
  let fixture: ComponentFixture<LoanPayments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanPayments]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanPayments);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
