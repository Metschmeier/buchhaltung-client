import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private _loading = signal(false);
  isLoading = this._loading.asReadonly();

  setLoading(isLoading: boolean) {
    this._loading.set(isLoading);
  }
}