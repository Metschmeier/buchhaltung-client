import { Injectable, inject, signal, Signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { SteuersatzService } from '../services/steuersatz.service';
import { Steuersatz } from '../types/steuersatz.type';

@Injectable({
  providedIn: 'root'
})
export class SteuersatzFacade {
  private steuersatzService = inject(SteuersatzService);

  private _steuersaetze = signal<Steuersatz[]>([]);
  readonly steuersaetze: Signal<Steuersatz[]> = this._steuersaetze.asReadonly();

  constructor() {
    this.loadAll();
  }

  private loadAll(): void {
    this.steuersatzService.getAll().subscribe(data => {
      this._steuersaetze.set(data);
    });
  }

  create(steuersatz: Steuersatz): Observable<Steuersatz> {
    return this.steuersatzService.create(steuersatz).pipe(
      tap(neu => {
        this._steuersaetze.update(current => [...current, neu]);
      })
    );
  }

  update(id: number, steuersatz: Steuersatz): Observable<void> {
    return this.steuersatzService.update(id, steuersatz).pipe(
      tap(() => {
        this._steuersaetze.update(current => {
          const index = current.findIndex(s => s.id === id);
          if (index > -1) {
            const copy = [...current];
            copy[index] = steuersatz;
            return copy;
          }
          return current;
        });
      })
    );
  }

  delete(id: number): Observable<void> {
    return this.steuersatzService.delete(id).pipe(
      tap(() => {
        this._steuersaetze.update(current => current.filter(s => s.id !== id));
      })
    );
  }
}