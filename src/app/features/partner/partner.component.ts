import { Component, OnInit, AfterViewInit, ViewChild, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { PartnerFacade } from '../../core/facades/partner.facade';
import { Partner } from '../../core/types/partner.type';

interface PartnerForm {
  id: FormControl<number>;
  kontonummer: FormControl<string>;
  name: FormControl<string>;
  typ: FormControl<string>;
  adresse: FormControl<string>;
  eMail: FormControl<string>;
}

@Component({
  selector: 'app-partner',
  standalone: true,
  templateUrl: './partner.component.html',
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
export class PartnerComponent implements OnInit, AfterViewInit {
  private partnerFacade = inject(PartnerFacade);

  displayedColumns = ['name', 'kontonummer', 'typ', 'eMail', 'aktionen'];
  dataSource = new MatTableDataSource<Partner>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private updateTableEffect = effect(() => {
    this.dataSource.data = this.partnerFacade.partners();
  });

  form: FormGroup<PartnerForm> = new FormGroup<PartnerForm>({
    id: new FormControl(0, { nonNullable: true }),
    kontonummer: new FormControl('', { validators: Validators.required, nonNullable: true }),
    name: new FormControl('', { validators: Validators.required, nonNullable: true }),
    typ: new FormControl('', { validators: Validators.required, nonNullable: true }),
    adresse: new FormControl('', { validators: Validators.required, nonNullable: true }),
    eMail: new FormControl('', { validators: Validators.email, nonNullable: true })
  });

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  savePartner(): void {
    if (this.form.invalid) return;

    const partner: Partner = this.form.getRawValue();

    if (partner.id === 0) {
      this.partnerFacade.create(partner).subscribe(() => this.form.reset());
    } else {
      this.partnerFacade.update(partner.id, partner).subscribe(() => this.form.reset());
    }
  }

  editPartner(partner: Partner): void {
    this.form.setValue({ ...partner });
  }

  deletePartner(id: number): void {
    if (confirm('Wirklich löschen?')) {
      this.partnerFacade.delete(id).subscribe(() => {
        if (this.form.value.id === id) {
          this.form.reset();
        }
      });
    }
  }
}