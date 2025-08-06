import { Injectable, inject, signal, Signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { KostenstelleService } from '../services/kostenstelle.service';
import { Kostenstelle } from '../types/kostenstelle.type';

@Injectable({
  providedIn: 'root'
})
export class KostenstelleFacade {
  private kostenstelleService = inject(KostenstelleService);

  private _kostenstellen = signal<Kostenstelle[]>([]);
  readonly kostenstellen: Signal<Kostenstelle[]> = this._kostenstellen.asReadonly();

  constructor() {
    this.loadAll();
  }

  private loadAll(): void {
    this.kostenstelleService.getAll().subscribe(kostenstellen => {
      this._kostenstellen.set(kostenstellen);
    });
  }

  create(kostenstelle: Kostenstelle): Observable<Kostenstelle> {
    return this.kostenstelleService.create(kostenstelle).pipe(
      tap(neu => {
        this._kostenstellen.update(current => [...current, neu]);
      })
    );
  }

  update(id: number, kostenstelle: Kostenstelle): Observable<void> {
    return this.kostenstelleService.update(id, kostenstelle).pipe(
      tap(() => {
        this._kostenstellen.update(current => {
          const index = current.findIndex(k => k.id === id);
          if (index > -1) {
            const copy = [...current];
            copy[index] = kostenstelle;
            return copy;
          }
          return current;
        });
      })
    );
  }

  delete(id: number): Observable<void> {
    return this.kostenstelleService.delete(id).pipe(
      tap(() => {
        this._kostenstellen.update(current => current.filter(k => k.id !== id));
      })
    );
  }
}