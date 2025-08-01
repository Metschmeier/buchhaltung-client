import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Buchung } from '../types/buchung.type';
import { BuchungService } from '../services/buchung.service';

@Injectable({
  providedIn: 'root'
})
export class BuchungFacade {
  private buchungService = inject(BuchungService);

  private _buchungen = new BehaviorSubject<Buchung[]>([]);
  readonly buchungen$ = this._buchungen.asObservable();

  constructor() {
    this.loadAll();
  }

  loadAll(): void {
    this.buchungService.getAll().subscribe((buchungen) => {
      this._buchungen.next(buchungen);
    });
  }

  create(buchung: Buchung): Observable<Buchung> {
    return this.buchungService.create(buchung).pipe(
      tap((neu) => {
        const aktuelle = this._buchungen.getValue();
        this._buchungen.next([...aktuelle, neu]);
      })
    );
  }

  update(id: number, buchung: Buchung): Observable<void> {
    return this.buchungService.update(id, buchung).pipe(
      tap(() => {
        const aktuelle = this._buchungen.getValue();
        const index = aktuelle.findIndex((b) => b.id === id);
        if (index > -1) {
          aktuelle[index] = buchung;
          this._buchungen.next([...aktuelle]);
        }
      })
    );
  }

  delete(id: number): Observable<void> {
    return this.buchungService.delete(id).pipe(
      tap(() => {
        const aktuelle = this._buchungen.getValue();
        this._buchungen.next(aktuelle.filter((b) => b.id !== id));
      })
    );
  }
}