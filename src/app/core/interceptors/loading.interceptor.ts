import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LoadingService } from '../services/loading.service';
import { catchError, finalize, tap, throwError } from 'rxjs';

export const httpLoadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  const toastr = inject(ToastrService);

  loadingService.setLoading(true);

  return next(req).pipe(
    tap(() => {
      // optional: hier kannst du bei Erfolg was machen
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
      return throwError(() => error);
    }),
    finalize(() => {
      loadingService.setLoading(false);
    })
  );
};