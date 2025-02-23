import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Product } from '../product.model';

export const productsPageActions = createActionGroup({
  source: 'Products Page',
  events: {
    'Toggle Show Product Code': emptyProps,
    'Load Products': emptyProps,
    'Add Product': props<{ product: Product }>(),
    'Update Product': props<{ product: Product }>(),
    'Delete Product': props<{ id: number }>(),
  },
});

export const productsApiActions = createActionGroup({
  source: 'Products API',
  events: {
    'Products Loaded Success': props<{ products: Product[] }>(),
    'Products Loaded Fail:': props<{ message: string }>(),
    'Products Added Success': props<{ product: Product }>(),
    'Products Added Fail:': props<{ message: string }>(),
    'Update Product Success': props<{ product: Product }>(),
    'Update Product Fail': props<{ message: string }>(),
    'Delete Product Success': props<{ id: number }>(),
    'Delete Product Fail': props<{ message: string }>(),
  },
});
