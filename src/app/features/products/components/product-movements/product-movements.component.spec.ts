import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductMovementsComponent } from './product-movements.component';

describe('ProductMovementsComponent', () => {
  let component: ProductMovementsComponent;
  let fixture: ComponentFixture<ProductMovementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductMovementsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductMovementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
