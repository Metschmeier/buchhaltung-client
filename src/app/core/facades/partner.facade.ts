import { Injectable, inject, signal, Signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { PartnerService } from '../services/partner.service';
import { Partner } from '../types/partner.type';

@Injectable({
  providedIn: 'root'
})
export class PartnerFacade {
  private partnerService = inject(PartnerService);

  private _partners = signal<Partner[]>([]);
  readonly partners: Signal<Partner[]> = this._partners.asReadonly();

  constructor() {
    this.loadAll();
  }

  private loadAll(): void {
    this.partnerService.getAll().subscribe(partners => {
      this._partners.set(partners);
    });
  }

  create(partner: Partner): Observable<Partner> {
    return this.partnerService.create(partner).pipe(
      tap(neu => {
        this._partners.update(current => [...current, neu]);
      })
    );
  }

  update(id: number, partner: Partner): Observable<void> {
    return this.partnerService.update(id, partner).pipe(
      tap(() => {
        this._partners.update(current => {
          const index = current.findIndex(p => p.id === id);
          if (index > -1) {
            const copy = [...current];
            copy[index] = partner;
            return copy;
          }
          return current;
        });
      })
    );
  }

  delete(id: number): Observable<void> {
    return this.partnerService.delete(id).pipe(
      tap(() => {
        this._partners.update(current => current.filter(p => p.id !== id));
      })
    );
  }
}