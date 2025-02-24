import { Injectable } from '@angular/core';
import { ProductsService } from '../products.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { productsApiActions, productsPageActions } from './products.actions';
import { catchError, concatMap, exhaustMap, map, mergeMap, of } from 'rxjs';

@Injectable()
export class ProductEffects {
  constructor(
    private actions$: Actions,
    private productsService: ProductsService
  ) {}

  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(productsPageActions.loadProducts),
      // Ignores subsequent requests until complete. Fine for loading where data is unlikely to change so quickly.
      exhaustMap(() =>
        this.productsService.getAll().pipe(
          map((products) =>
            productsApiActions.productsLoadedSuccess({ products })
          ),
          catchError((error) =>
            of(productsApiActions.productsLoadedFail({ message: error }))
          )
        )
      )
    )
  );

  addProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(productsPageActions.addProduct),
      // Run add requests in parallel
      mergeMap(({ product }) =>
        this.productsService.add(product).pipe(
          map((newProduct) =>
            productsApiActions.productAddedSuccess({ product: newProduct })
          ),
          catchError((error) =>
            of(productsApiActions.productAddedFail({ message: error }))
          )
        )
      )
    )
  );

  updateProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(productsPageActions.updateProduct),
      // Run sequentially, update one by one
      concatMap(({ product }) =>
        this.productsService.update(product).pipe(
          map((updatedProduct) =>
            productsApiActions.productUpdatedSuccess({
              product: updatedProduct,
            })
          ),
          catchError((error) =>
            of(productsApiActions.productUpdatedFail({ message: error }))
          )
        )
      )
    )
  );

  deleteProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(productsPageActions.deleteProduct),
      // Delete in parallel
      mergeMap(({ id }) =>
        this.productsService.delete(id).pipe(
          map(() => productsApiActions.productDeletedSuccess({ id })),
          catchError((error) =>
            of(productsApiActions.productDeletedFail({ message: error }))
          )
        )
      )
    )
  );
}
