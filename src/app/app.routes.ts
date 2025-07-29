import { Routes } from '@angular/router';
import { PartnerComponent } from './features/partner/partner.component';

export const routes: Routes = [
  { path: '', redirectTo: 'partner', pathMatch: 'full' },
  { path: 'partner', component: PartnerComponent }
];