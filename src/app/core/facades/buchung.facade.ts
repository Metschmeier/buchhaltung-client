import { Injectable, computed, inject, signal, Signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Buchung } from '../types/buchung.type';
import { BuchungService } from '../services/buchung.service';

@Injectable({
  providedIn: 'root'
})
export class BuchungFacade {
  private buchungService = inject(BuchungService);

  private _buchungen = signal<Buchung[]>([]);
  readonly buchungen: Signal<Buchung[]> = this._buchungen.asReadonly();

  readonly einkaeufe = computed(() =>
    this._buchungen().filter(b => b.typ === 'Einkauf')
  );

  constructor() {
    this.loadAll();
  }

  loadAll(): void {
    this.buchungService.getAll().subscribe((buchungen) => {
      this._buchungen.set(buchungen);
    });
  }

  create(buchung: Buchung): Observable<Buchung> {
    return this.buchungService.create(buchung).pipe(
      tap((neu) => {
        this._buchungen.update((aktuelle) => [...aktuelle, neu]);
      })
    );
  }

  update(id: number, buchung: Buchung): Observable<void> {
    return this.buchungService.update(id, buchung).pipe(
      tap(() => {
        this._buchungen.update((aktuelle) => {
          const index = aktuelle.findIndex((b) => b.id === id);
          if (index > -1) {
            const neue = [...aktuelle];
            neue[index] = buchung;
            return neue;
          }
          return aktuelle;
        });
      })
    );
  }

  delete(id: number): Observable<void> {
    return this.buchungService.delete(id).pipe(
      tap(() => {
        this._buchungen.update((aktuelle) => aktuelle.filter((b) => b.id !== id));
      })
    );
  }
}