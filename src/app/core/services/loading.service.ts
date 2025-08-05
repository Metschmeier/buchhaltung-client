import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private _loading = signal(false);
  isLoading = this._loading.asReadonly();

  private loadingTimeout: any;

  showLoadingWithDelay(delay = 200) {
    if (this.loadingTimeout) return; // Wenn Timer schon läuft, nichts machen
    this.loadingTimeout = setTimeout(() => {
      this._loading.set(true);
    }, delay);
  }

  hideLoading() {
    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout);
      this.loadingTimeout = null;
    }
    this._loading.set(false);
  }
}