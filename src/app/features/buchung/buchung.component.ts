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
  betragnetto: FormControl<number>;
  partnerid: FormControl<number | null>;
  kategorieid: FormControl<number | null>;
  kostenstelleid: FormControl<number | null>;
  steuersatzid: FormControl<number | null>;
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

  kategorien$ = this.kategorieFacade.kategorien$;
  partners$ = this.partnerFacade.partners$;
  kostenstellen$ = this.kostenstelleFacade.kostenstellen$;
  steuersaetze$ = this.steuersatzFacade.steuersaetze$;

  form: FormGroup<BuchungForm> = new FormGroup<BuchungForm>({
    id: new FormControl(0, { nonNullable: true }),
    datum: new FormControl(new Date(), { validators: Validators.required, nonNullable: true }),
    typ: new FormControl('', { validators: Validators.required, nonNullable: true }),
    beschreibung: new FormControl('', { validators: Validators.required, nonNullable: true }),
    betragnetto: new FormControl(0, { validators: [Validators.required, Validators.min(0.01)], nonNullable: true }),
    partnerid: new FormControl<number | null>(null, { validators: Validators.required }),
    kategorieid: new FormControl<number | null>(null, { validators: Validators.required }),
    kostenstelleid: new FormControl<number | null>(null, { validators: Validators.required }),
    steuersatzid: new FormControl<number | null>(null, { validators: Validators.required }),
    locked: new FormControl(false, { nonNullable: true })
  });

  ngOnInit(): void {
  }

  saveBuchung(): void {
    if (this.form.invalid) return;

    const raw = this.form.getRawValue();

    const buchung: Buchung = {
      ...raw,
      partnerid: raw.partnerid ?? 0,
      kategorieid: raw.kategorieid ?? 0,
      kostenstelleid: raw.kostenstelleid ?? 0,
      steuersatzid: raw.steuersatzid ?? 0
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
      betragnetto: b.betragnetto,
      partnerid: b.partnerid,
      kategorieid: b.kategorieid,
      kostenstelleid: b.kostenstelleid,
      steuersatzid: b.steuersatzid,
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
}