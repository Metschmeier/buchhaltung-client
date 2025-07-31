import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { KostenstelleService } from '../services/kostenstelle.service';
import { Kostenstelle } from '../types/kostenstelle.types';

@Injectable({
  providedIn: 'root'
})
export class KostenstelleFacade {
  readonly kostenstellen$: Observable<Kostenstelle[]>;

  constructor(private kostenstelleService: KostenstelleService) {
    this.kostenstellen$ = this.kostenstelleService.getAll();
  }

  create(kostenstelle: Kostenstelle): Observable<Kostenstelle> {
    return this.kostenstelleService.create(kostenstelle);
  }

  update(id: number, kostenstelle: Kostenstelle): Observable<void> {
    return this.kostenstelleService.update(id, kostenstelle);
  }

  delete(id: number): Observable<void> {
    return this.kostenstelleService.delete(id);
  }
}