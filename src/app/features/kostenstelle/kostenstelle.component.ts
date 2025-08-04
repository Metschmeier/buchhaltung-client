import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { KostenstelleFacade } from '../../core/facades/kostenstelle.facade';
import { Kostenstelle } from '../../core/types/kostenstelle.types';

interface KostenstelleForm {
  id: FormControl<number>;
  kostenstelle: FormControl<string>;
  beschreibung: FormControl<string>;
}

@Component({
  selector: 'app-kostenstelle',
  standalone: true,
  templateUrl: './kostenstelle.component.html',
  styleUrls: ['./kostenstelle.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class KostenstelleComponent implements OnInit {
  private kostenstelleFacade = inject(KostenstelleFacade);

  // Signal statt Observable:
  kostenstellen = this.kostenstelleFacade.kostenstellen;

  form: FormGroup<KostenstelleForm> = new FormGroup<KostenstelleForm>({
    id: new FormControl(0, { nonNullable: true }),
    kostenstelle: new FormControl('', { validators: Validators.required, nonNullable: true }),
    beschreibung: new FormControl('', { validators: Validators.required, nonNullable: true }),
  });

  ngOnInit(): void {
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