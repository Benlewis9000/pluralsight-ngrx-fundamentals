import { createReducer, on } from '@ngrx/store';
import { productsApiActions, productsPageActions } from './products.actions';
import { Product } from '../product.model';

export interface ProductsState {
  showProductCode: boolean;
  loading: boolean;
  products: Product[];
}

const initialState: ProductsState = {
  showProductCode: true,
  loading: false,
  products: [],
};

export const productsReducer = createReducer(
  initialState,
  on(productsPageActions.toggleShowProductCode, (state) => ({
    ...state,
    showProductCode: !state.showProductCode,
  })),
  on(productsPageActions.loadProducts, (state) => ({
    ...state,
    loading: true,
  })),
  on(productsApiActions.productsLoadedSuccess, (state, { products }) => ({
    ...state,
    loading: false,
    products,
  }))
);
