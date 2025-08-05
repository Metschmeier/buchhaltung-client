import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { Buchung } from '../../core/types/buchung.type';

import { BuchungFacade } from '../../core/facades/buchung.facade';
import { KategorieFacade } from '../../core/facades/kategorie.facade';
import { PartnerFacade } from '../../core/facades/partner.facade';
import { KostenstelleFacade } from '../../core/facades/kostenstelle.facade';
import { SteuersatzFacade } from '../../core/facades/steuersatz.facade';

interface BuchungForm {
  id: FormControl<number>;
  datum: FormControl<Date>;
  typ: FormControl<string>;
  beschreibung: FormControl<string>;
  betragNetto: FormControl<number>;
  partnerId: FormControl<number | null>;
  kategorieId: FormControl<number | null>;
  kostenstelleId: FormControl<number | null>;
  steuersatzId: FormControl<number | null>;
  locked: FormControl<boolean>;
}

@Component({
  selector: 'app-buchung',
  standalone: true,
  templateUrl: './buchung.component.html',
  styleUrls: ['./buchung.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class BuchungComponent implements OnInit {
  private buchungFacade = inject(BuchungFacade);
  private kategorieFacade = inject(KategorieFacade);
  private partnerFacade = inject(PartnerFacade);
  private kostenstelleFacade = inject(KostenstelleFacade);
  private steuersatzFacade = inject(SteuersatzFacade);

  readonly buchungen = this.buchungFacade.buchungen;
  readonly einkaeufe = this.buchungFacade.einkaeufe;

  readonly kategorien = this.kategorieFacade.kategorien;
  readonly partners = this.partnerFacade.partners;
  readonly kostenstellen = this.kostenstelleFacade.kostenstellen;
  readonly steuersaetze = this.steuersatzFacade.steuersaetze;

  form: FormGroup<BuchungForm> = new FormGroup<BuchungForm>({
    id: new FormControl(0, { nonNullable: true }),
    datum: new FormControl(new Date(), { validators: Validators.required, nonNullable: true }),
    typ: new FormControl('', { validators: Validators.required, nonNullable: true }),
    beschreibung: new FormControl('', { validators: Validators.required, nonNullable: true }),
    betragNetto: new FormControl(0, { validators: [Validators.required, Validators.min(0.01)], nonNullable: true }),
    partnerId: new FormControl<number | null>(null, { validators: Validators.required }),
    kategorieId: new FormControl<number | null>(null, { validators: Validators.required }),
    kostenstelleId: new FormControl<number | null>(null, { validators: Validators.required }),
    steuersatzId: new FormControl<number | null>(null, { validators: Validators.required }),
    locked: new FormControl(false, { nonNullable: true })
  });

  ngOnInit(): void {}

  saveBuchung(): void {
    if (this.form.invalid) return;

    const raw = this.form.getRawValue();

    const buchung: Buchung = {
      ...raw,
      partnerId: raw.partnerId ?? 0,
      kategorieId: raw.kategorieId ?? 0,
      kostenstelleId: raw.kostenstelleId ?? 0,
      steuersatzId: raw.steuersatzId ?? 0,
      betragNetto: raw.betragNetto ?? 0,
    };

    if (buchung.id === 0) {
      this.buchungFacade.create(buchung).subscribe(() => this.form.reset());
    } else {
      this.buchungFacade.update(buchung.id, buchung).subscribe(() => this.form.reset());
    }
  }

  editBuchung(b: Buchung): void {
    this.form.setValue({
      id: b.id,
      datum: new Date(b.datum),
      typ: b.typ,
      beschreibung: b.beschreibung,
      betragNetto: b.betragNetto,
      partnerId: b.partnerId,
      kategorieId: b.kategorieId,
      kostenstelleId: b.kostenstelleId,
      steuersatzId: b.steuersatzId,
      locked: b.locked
    });
  }

  deleteBuchung(id: number): void {
    if (confirm('Wirklich löschen?')) {
      this.buchungFacade.delete(id).subscribe(() => {
        if (this.form.value.id === id) {
          this.form.reset();
        }
      });
    }
  }

  exportCsv(): void {
    const buchungen = this.buchungFacade.buchungen();
    const kategorien = this.kategorieFacade.kategorien();
    const partner = this.partnerFacade.partners();
    const kostenstellen = this.kostenstelleFacade.kostenstellen();
    const steuersaetze = this.steuersatzFacade.steuersaetze();

    const kategorieMap = new Map(kategorien.map(k => [k.id, k]));
    const partnerMap = new Map(partner.map(p => [p.id, p]));
    const kostenstelleMap = new Map(kostenstellen.map(k => [k.id, k]));
    const steuersatzMap = new Map(steuersaetze.map(s => [s.id, s]));

    const header = 'Datum;Typ;Beschreibung;Betrag Netto;Kategorie;Partner;Kostenstelle;Steuersatz';

    const csv = buchungen.map(b => {
      const datum = b.datum ? new Date(b.datum).toLocaleDateString('de-AT') : '';
      const typ = b.typ ?? '';
      const beschreibung = b.beschreibung ?? '';
      const betrag = (typeof b.betragNetto === 'number')
        ? b.betragNetto.toLocaleString('de-AT', { minimumFractionDigits: 2 })
        : '';

      const kategorie = (b.kategorieId && b.kategorieId !== 0)
        ? kategorieMap.get(b.kategorieId)?.kategorie ?? ''
        : '';

      const partnerName = (b.partnerId && b.partnerId !== 0)
        ? partnerMap.get(b.partnerId)?.name ?? ''
        : '';

      const kostenstelleName = (b.kostenstelleId && b.kostenstelleId !== 0)
        ? kostenstelleMap.get(b.kostenstelleId)?.kostenstelle ?? ''
        : '';

      const steuersatzName = (b.steuersatzId && b.steuersatzId !== 0)
        ? steuersatzMap.get(b.steuersatzId)?.bezeichnung ?? ''
        : '';

      return [datum, typ, beschreibung, betrag, kategorie, partnerName, kostenstelleName, steuersatzName].join(';');
    }).join('\n');

    const blob = new Blob([header + '\n' + csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'buchungen.csv';
    a.click();

    window.URL.revokeObjectURL(url);
  }
}