import { Injectable } from '@angular/core';
import { ProductsService } from '../products.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { productsApiActions, productsPageActions } from './products.actions';
import { catchError, concatMap, exhaustMap, map, mergeMap, of, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class ProductEffects {

  ngrxOnInitEffects(){
    return productsPageActions.loadProducts();
  }

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
          map(() =>
            productsApiActions.productUpdatedSuccess({
              product: product,
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

  redirectToProductsPage$ = createEffect(
    () => this.actions$.pipe(
      ofType(productsApiActions.productAddedSuccess, productsApiActions.productDeletedSuccess, productsApiActions.productUpdatedSuccess),
      tap(() => this.router.navigateByUrl('/products'))
    ),
    // Executes effect, but does not trigger more actions
    {dispatch: false}
  );

  constructor(
    private actions$: Actions,
    private productsService: ProductsService,
    private router: Router
  ) {}
}
