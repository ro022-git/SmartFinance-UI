import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeList } from './income-list';

describe('IncomeList', () => {
  let component: IncomeList;
  let fixture: ComponentFixture<IncomeList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncomeList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomeList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
