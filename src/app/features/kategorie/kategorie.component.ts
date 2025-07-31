import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { KategorieFacade } from '../../core/facades/kategorie.facade';
import { Kategorie } from '../../core/types/kategorie.type';

interface KategorieForm {
  id: FormControl<number>;
  kategorienummer: FormControl<string>;
  kategorie: FormControl<string>;
}

@Component({
  selector: 'app-kategorie',
  standalone: true,
  templateUrl: './kategorie.component.html',
  styleUrls: ['./kategorie.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class KategorieComponent implements OnInit {
  private kategorieFacade = inject(KategorieFacade);

  kategorien$ = this.kategorieFacade.kategorien$;

  form: FormGroup<KategorieForm> = new FormGroup<KategorieForm>({
    id: new FormControl(0, { nonNullable: true }),
    kategorienummer: new FormControl('', { validators: Validators.required, nonNullable: true }),
    kategorie: new FormControl('', { validators: Validators.required, nonNullable: true }),
  });

  ngOnInit(): void {
    // kein manuelles Laden mehr nötig, da kategorien$ direkt aus Facade kommt
  }

  saveKategorie(): void {
    if (this.form.invalid) return;

    const kategorie: Kategorie = this.form.getRawValue();

    if (kategorie.id === 0) {
      this.kategorieFacade.create(kategorie).subscribe(() => {
        this.form.reset();
      });
    } else {
      this.kategorieFacade.update(kategorie.id, kategorie).subscribe(() => {
        this.form.reset();
      });
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