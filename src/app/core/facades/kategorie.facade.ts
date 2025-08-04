import { Injectable, inject, signal, Signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { KategorieService } from '../services/kategorie.service';
import { Kategorie } from '../types/kategorie.type';

@Injectable({
  providedIn: 'root'
})
export class KategorieFacade {
  private kategorieService = inject(KategorieService);

  private _kategorien = signal<Kategorie[]>([]);
  readonly kategorien: Signal<Kategorie[]> = this._kategorien.asReadonly();

  constructor() {
    this.loadAll();
  }

  private loadAll(): void {
    this.kategorieService.getAll().subscribe(kategorien => {
      this._kategorien.set(kategorien);
    });
  }

  create(kategorie: Kategorie): Observable<Kategorie> {
    return this.kategorieService.create(kategorie).pipe(
      tap(neu => {
        this._kategorien.update(current => [...current, neu]);
      })
    );
  }

  update(id: number, kategorie: Kategorie): Observable<void> {
    return this.kategorieService.update(id, kategorie).pipe(
      tap(() => {
        this._kategorien.update(current => {
          const index = current.findIndex(k => k.id === id);
          if (index > -1) {
            const copy = [...current];
            copy[index] = kategorie;
            return copy;
          }
          return current;
        });
      })
    );
  }

  delete(id: number): Observable<void> {
    return this.kategorieService.delete(id).pipe(
      tap(() => {
        this._kategorien.update(current => current.filter(k => k.id !== id));
      })
    );
  }
}