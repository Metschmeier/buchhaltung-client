import { Component, OnInit, AfterViewInit, ViewChild, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

import { KategorieFacade } from '../../core/facades/kategorie.facade';
import { Kategorie } from '../../core/types/kategorie.type';
import { BaseCrudTableComponent } from '../../core/directives/base-crud-table.component';
import { FormErrorComponent } from '../../core/shared/form-error/form-error.component';

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
    MatSortModule,
    FormErrorComponent
  ]
})
export class KategorieComponent extends BaseCrudTableComponent<Kategorie> implements OnInit, AfterViewInit {
  override loadData(): void {
    this.updateTableFrom(this.kategorien());
  }
  protected onEdit(item: Kategorie): void {
    this.editKategorie(item);
  }
  protected onDelete(id: number): void {
    this.deleteKategorie(id);
  }

  private kategorieFacade = inject(KategorieFacade);

  override displayedColumns = ['kategorieNummer', 'kategorie', 'aktionen'];

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
    this.loadData();
  }

  saveKategorie(): void {
    if (this.form.invalid) return;

    const kategorie: Kategorie = this.form.getRawValue();

    if (kategorie.id === 0) {
      this.kategorieFacade.create(kategorie).subscribe(() => { this.form.reset(); this.loadData(); });
    } else {
      this.kategorieFacade.update(kategorie.id, kategorie).subscribe(() => { this.form.reset(); this.loadData });
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
        this.loadData()
      });
    }
  }
}