import { Component, OnInit, AfterViewInit, ViewChild, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { KostenstelleFacade } from '../../core/facades/kostenstelle.facade';
import { Kostenstelle } from '../../core/types/kostenstelle.type';

interface KostenstelleForm {
  id: FormControl<number>;
  kostenstelle: FormControl<string>;
  beschreibung: FormControl<string>;
}

@Component({
  selector: 'app-kostenstelle',
  standalone: true,
  templateUrl: './kostenstelle.component.html',
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
export class KostenstelleComponent implements OnInit, AfterViewInit {
  private kostenstelleFacade = inject(KostenstelleFacade);

  displayedColumns = ['kostenstelle', 'beschreibung', 'aktionen'];
  dataSource = new MatTableDataSource<Kostenstelle>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  kostenstellen = this.kostenstelleFacade.kostenstellen;

  private updateTableEffect = effect(() => {
    this.dataSource.data = this.kostenstellen();
  });

  form: FormGroup<KostenstelleForm> = new FormGroup<KostenstelleForm>({
    id: new FormControl(0, { nonNullable: true }),
    kostenstelle: new FormControl('', { validators: Validators.required, nonNullable: true }),
    beschreibung: new FormControl('', { validators: Validators.required, nonNullable: true }),
  });

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  saveKostenstelle(): void {
    if (this.form.invalid) return;

    const kostenstelle: Kostenstelle = this.form.getRawValue();

    if (kostenstelle.id === 0) {
      this.kostenstelleFacade.create(kostenstelle).subscribe(() => this.form.reset());
    } else {
      this.kostenstelleFacade.update(kostenstelle.id, kostenstelle).subscribe(() => this.form.reset());
    }
  }

  editKostenstelle(kostenstelle: Kostenstelle): void {
    this.form.setValue({ ...kostenstelle });
  }

  deleteKostenstelle(id: number): void {
    if (confirm('Wirklich löschen?')) {
      this.kostenstelleFacade.delete(id).subscribe(() => {
        if (this.form.value.id === id) {
          this.form.reset();
        }
      });
    }
  }
}
