import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PartnerService } from '../services/partner.service';
import { Partner } from '../types/partner.type';

@Injectable({
  providedIn: 'root'
})
export class PartnerFacade {
  readonly partners$: Observable<Partner[]>;

  constructor(private partnerService: PartnerService) {
    this.partners$ = this.partnerService.getAll();
  }

  create(partner: Partner): Observable<Partner> {
    return this.partnerService.create(partner);
  }

  update(id: number, partner: Partner): Observable<void> {
    return this.partnerService.update(id, partner);
  }

  delete(id: number): Observable<void> {
    return this.partnerService.delete(id);
  }
}