import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LoadingService } from '../services/loading.service';
import { catchError, finalize, tap } from 'rxjs';

export const httpLoadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  const toastr = inject(ToastrService);

  loadingService.showLoadingWithDelay(200);

  return next(req).pipe(
    tap(() => {
      // optionaler Erfolgscode
    }),
    catchError(error => {
      if (error.status === 400) {
        toastr.error('Ungültige Anfrage', 'Fehler 400');
      } else if (error.status === 500) {
        toastr.error('Serverfehler', 'Fehler 500');
      } else if (error.status === 401) {
        toastr.error('Nicht autorisiert', 'Fehler 401');
      } else {
        toastr.error('Unbekannter Fehler');
      }
      throw error;
    }),
    finalize(() => {
      loadingService.hideLoading();
    })
  );
};