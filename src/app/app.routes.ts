import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PartnerComponent } from '../app/features/partner/partner.component';
import { KategorieComponent } from '../app/features/kategorie/kategorie.component';
import { SteuersatzComponent } from '../app/features/steuersatz/steuersatz.component';
import { KostenstelleComponent } from '../app/features/kostenstelle/kostenstelle.component';
import { BuchungComponent } from '../app/features/buchung/buchung.component';
import { LoginComponent } from '../app/features/login/login.component';
import { authGuard } from './guards/auth.guard';

export const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: HomeComponent, canActivate: [authGuard] },
  { path: 'partner', component: PartnerComponent, canActivate: [authGuard] },
  { path: 'kategorie', component: KategorieComponent, canActivate: [authGuard] },
  { path: 'steuersatz', component: SteuersatzComponent, canActivate: [authGuard] },
  { path: 'kostenstelle', component: KostenstelleComponent, canActivate: [authGuard] },
  { path: 'buchung', component: BuchungComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];