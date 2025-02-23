import { Component } from '@angular/core';
import { ProductsService } from '../products.service';
import { Store } from '@ngrx/store';
import {
  productsPageActions,
  productsApiActions,
} from '../state/products.actions';
import {
  selectProducts,
  selectProductsLoading,
  selectProductsTotal,
} from '../state/products.selectors';

@Component({
  selector: 'app-products-page',
  templateUrl: './products-page.component.html',
  styleUrls: ['./products-page.component.css'],
})
export class ProductsPageComponent {
  products$ = this.store.select(selectProducts);
  total$ = this.store.select(selectProductsTotal);
  loading$ = this.store.select(selectProductsLoading);
  showProductCode$ = this.store.select(
    (state: any) => state.products.showProductCode
  );
  errorMessage = '';

  constructor(private productsService: ProductsService, private store: Store) {
    this.store.subscribe(console.log);
  }

  ngOnInit() {
    this.getProducts();
  }

  getProducts() {
    this.store.dispatch(productsPageActions.loadProducts());
    this.productsService.getAll().subscribe({
      next: (products) => {
        this.store.dispatch(
          productsApiActions.productsLoadedSuccess({ products })
        );
      },
      error: (error) => (this.errorMessage = error),
    });
  }

  toggleShowProductCode() {
    this.store.dispatch(productsPageActions.toggleShowProductCode());
  }
}
