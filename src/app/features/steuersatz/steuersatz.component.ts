import { Component, OnInit, AfterViewInit, ViewChild, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { SteuersatzFacade } from '../../core/facades/steuersatz.facade';
import { Steuersatz } from '../../core/types/steuersatz.type';

interface SteuersatzForm {
  id: FormControl<number>;
  bezeichnung: FormControl<string>;
  prozentsatz: FormControl<number>;
}

@Component({
  selector: 'app-steuersatz',
  standalone: true,
  templateUrl: './steuersatz.component.html',
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
export class SteuersatzComponent implements OnInit, AfterViewInit {
  private steuersatzFacade = inject(SteuersatzFacade);

  displayedColumns = ['bezeichnung', 'prozentsatz', 'aktionen'];
  dataSource = new MatTableDataSource<Steuersatz>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  steuersaetze = this.steuersatzFacade.steuersaetze;

  private updateTableEffect = effect(() => {
    this.dataSource.data = this.steuersaetze();
  });

  form: FormGroup<SteuersatzForm> = new FormGroup<SteuersatzForm>({
    id: new FormControl(0, { nonNullable: true }),
    bezeichnung: new FormControl('', { validators: Validators.required, nonNullable: true }),
    prozentsatz: new FormControl(0, {
      validators: [Validators.required, Validators.min(0.00001)],
      nonNullable: true
    }),
  });

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  saveSteuersatz(): void {
    if (this.form.invalid) return;

    const steuersatz: Steuersatz = this.form.getRawValue();

    if (steuersatz.id === 0) {
      this.steuersatzFacade.create(steuersatz).subscribe(() => this.form.reset());
    } else {
      this.steuersatzFacade.update(steuersatz.id, steuersatz).subscribe(() => this.form.reset());
    }
  }

  editSteuersatz(steuersatz: Steuersatz): void {
    this.form.setValue({ ...steuersatz });
  }

  deleteSteuersatz(id: number): void {
    if (confirm('Wirklich löschen?')) {
      this.steuersatzFacade.delete(id).subscribe(() => {
        if (this.form.value.id === id) {
          this.form.reset();
        }
      });
    }
  }
}
