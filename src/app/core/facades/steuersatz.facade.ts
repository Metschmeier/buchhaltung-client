import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { SteuersatzService } from '../services/steuersatz.service';
import { Steuersatz } from '../types/steuersatz.type';

@Injectable({
  providedIn: 'root'
})
export class SteuersatzFacade {
  private steuersatzService = inject(SteuersatzService);
  readonly steuersaetze$: Observable<Steuersatz[]> = this.steuersatzService.getAll();

  create(steuersatz: Steuersatz): Observable<Steuersatz> {
    return this.steuersatzService.create(steuersatz);
  }

  update(id: number, steuersatz: Steuersatz): Observable<void> {
    return this.steuersatzService.update(id, steuersatz);
  }

  delete(id: number): Observable<void> {
    return this.steuersatzService.delete(id);
  }
}