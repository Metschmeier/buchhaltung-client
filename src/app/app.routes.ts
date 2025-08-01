import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PartnerComponent } from '../app/features/partner/partner.component';
import { KategorieComponent } from '../app/features/kategorie/kategorie.component';
import { SteuersatzComponent } from '../app/features/steuersatz/steuersatz.component';
import { KostenstelleComponent } from '../app/features/kostenstelle/kostenstelle.component';
import { BuchungComponent } from '../app/features/buchung/buchung.component';

export const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'partner', component: PartnerComponent },
  { path: 'kategorie', component: KategorieComponent },
  { path: 'steuersatz', component: SteuersatzComponent },
  { path: 'kostenstelle', component: KostenstelleComponent},
  { path: 'buchung', component: BuchungComponent },
];