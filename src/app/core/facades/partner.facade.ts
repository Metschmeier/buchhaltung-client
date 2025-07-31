import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PartnerService } from '../services/partner.service';
import { Partner } from '../types/partner.type';

@Injectable({
  providedIn: 'root'
})
export class PartnerFacade {
  private partnerService = inject(PartnerService);
  readonly partners$: Observable<Partner[]> = this.partnerService.getAll();

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