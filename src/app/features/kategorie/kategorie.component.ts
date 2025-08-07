import { Component, OnInit, AfterViewInit, ViewChild, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { KategorieFacade } from '../../core/facades/kategorie.facade';
import { Kategorie } from '../../core/types/kategorie.type';

interface KategorieForm {
  id: FormControl<number>;
  kategorieNummer: FormControl<string>;
  kategorie: FormControl<string>;
}

@Component({
  selector: 'app-kategorie',
  standalone: true,
  templateUrl: './kategorie.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule
  ]
})
export class KategorieComponent implements OnInit, AfterViewInit {
  private kategorieFacade = inject(KategorieFacade);

  displayedColumns = ['kategorieNummer', 'kategorie', 'aktionen'];
  dataSource = new MatTableDataSource<Kategorie>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  kategorien = this.kategorieFacade.kategorien;

  private updateTableEffect = effect(() => {
    this.dataSource.data = this.kategorien();
  });

  form: FormGroup<KategorieForm> = new FormGroup<KategorieForm>({
    id: new FormControl(0, { nonNullable: true }),
    kategorieNummer: new FormControl('', { validators: Validators.required, nonNullable: true }),
    kategorie: new FormControl('', { validators: Validators.required, nonNullable: true }),
  });

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  saveKategorie(): void {
    if (this.form.invalid) return;

    const kategorie: Kategorie = this.form.getRawValue();

    if (kategorie.id === 0) {
      this.kategorieFacade.create(kategorie).subscribe(() => this.form.reset());
    } else {
      this.kategorieFacade.update(kategorie.id, kategorie).subscribe(() => this.form.reset());
    }
  }

  editKategorie(kategorie: Kategorie): void {
    this.form.setValue({ ...kategorie });
  }

  deleteKategorie(id: number): void {
    if (confirm('Wirklich löschen?')) {
      this.kategorieFacade.delete(id).subscribe(() => {
        if (this.form.value.id === id) {
          this.form.reset();
        }
      });
    }
  }
}