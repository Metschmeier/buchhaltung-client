import { Component, OnInit, AfterViewInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Buchung } from '../../core/types/buchung.type';

import { BuchungFacade } from '../../core/facades/buchung.facade';
import { KategorieFacade } from '../../core/facades/kategorie.facade';
import { PartnerFacade } from '../../core/facades/partner.facade';
import { KostenstelleFacade } from '../../core/facades/kostenstelle.facade';
import { SteuersatzFacade } from '../../core/facades/steuersatz.facade';

@Component({
  selector: 'app-buchung',
  standalone: true,
  templateUrl: './buchung.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule
  ],
})
export class BuchungComponent implements OnInit, AfterViewInit {
  private buchungFacade = inject(BuchungFacade);
  private kategorieFacade = inject(KategorieFacade);
  private partnerFacade = inject(PartnerFacade);
  private kostenstelleFacade = inject(KostenstelleFacade);
  private steuersatzFacade = inject(SteuersatzFacade);

  readonly kategorien = this.kategorieFacade.kategorien;
  readonly partners = this.partnerFacade.partners;
  readonly kostenstellen = this.kostenstelleFacade.kostenstellen;
  readonly steuersaetze = this.steuersatzFacade.steuersaetze;

  // MatTable DataSource
  displayedColumns = [
    'datum',
    'typ',
    'beschreibung',
    'betragNetto',
    'partner',
    'kategorie',
    'kostenstelle',
    'steuersatz',
    'aktionen',
  ];
  dataSource = new MatTableDataSource<Buchung>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  form: FormGroup = new FormGroup({
    id: new FormControl(0, { nonNullable: true }),
    datum: new FormControl(new Date(), { validators: Validators.required, nonNullable: true }),
    typ: new FormControl('', { validators: Validators.required, nonNullable: true }),
    beschreibung: new FormControl('', { validators: Validators.required, nonNullable: true }),
    betragNetto: new FormControl(0, { validators: [Validators.required, Validators.min(0.01)], nonNullable: true }),
    partnerId: new FormControl<number | null>(null, { validators: Validators.required }),
    kategorieId: new FormControl<number | null>(null, { validators: Validators.required }),
    kostenstelleId: new FormControl<number | null>(null, { validators: Validators.required }),
    steuersatzId: new FormControl<number | null>(null, { validators: Validators.required }),
    locked: new FormControl(false, { nonNullable: true }),
  });

  ngOnInit(): void {
    // Reactive update of the table data whenever buchungen change
    this.updateTable();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private updateTable(): void {
    const buchungen = this.buchungFacade.buchungen(); // assuming synchronous getter as in Partner example
    this.dataSource.data = buchungen;
  }

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
      this.buchungFacade.create(buchung).subscribe(() => {
        this.form.reset();
        this.updateTable();
      });
    } else {
      this.buchungFacade.update(buchung.id, buchung).subscribe(() => {
        this.form.reset();
        this.updateTable();
      });
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
      locked: b.locked,
    });
  }

  deleteBuchung(id: number): void {
    if (confirm('Wirklich löschen?')) {
      this.buchungFacade.delete(id).subscribe(() => {
        if (this.form.value.id === id) {
          this.form.reset();
        }
        this.updateTable();
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
    }).join('\r\n');

    const blob = new Blob([header + '\n' + csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'buchungen.csv';
    a.click();

    window.URL.revokeObjectURL(url);
  }

  getPartnerName(id: number | null): string {
    return this.partners().find(p => p.id === id)?.name ?? '';
  }

  getKategorieName(id: number | null): string {
    return this.kategorien().find(k => k.id === id)?.kategorie ?? '';
  }

  getKostenstelleName(id: number | null): string {
    return this.kostenstellen().find(ks => ks.id === id)?.kostenstelle ?? '';
  }

  getSteuersatzBezeichnung(id: number | null): string {
    const satz = this.steuersaetze().find(s => s.id === id);
    return satz ? `${satz.bezeichnung} (${satz.prozentsatz}%)` : '';
  }
}
