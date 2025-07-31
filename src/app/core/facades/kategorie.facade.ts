import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { KategorieService } from '../services/kategorie.service';
import { Kategorie } from '../types/kategorie.type';

@Injectable({
  providedIn: 'root'
})
export class KategorieFacade {
  readonly kategorien$: Observable<Kategorie[]>;

  constructor(private kategorieService: KategorieService) {
    this.kategorien$ = this.kategorieService.getAll();
  }

  create(kategorie: Kategorie): Observable<Kategorie> {
    return this.kategorieService.create(kategorie);
  }

  update(id: number, kategorie: Kategorie): Observable<void> {
    return this.kategorieService.update(id, kategorie);
  }

  delete(id: number): Observable<void> {
    return this.kategorieService.delete(id);
  }
}