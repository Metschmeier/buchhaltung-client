import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { SteuersatzFacade } from '../../core/facades/steuersatz.facade';
import { Steuersatz } from '../../core/types/steuersatz.type';
import { Observable } from 'rxjs';

interface SteuersatzForm {
  id: FormControl<number>;
  bezeichnung: FormControl<string>;
  prozentsatz: FormControl<number>;
}

@Component({
  selector: 'app-steuersatz',
  standalone: true,
  templateUrl: './steuersatz.component.html',
  styleUrls: ['./steuersatz.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class SteuersatzComponent implements OnInit {
  private steuersatzFacade = inject(SteuersatzFacade);

  // Observable Stream für die Liste, direkt von der Facade
  steuersaetze$: Observable<Steuersatz[]> = this.steuersatzFacade.steuersaetze$;

  form: FormGroup<SteuersatzForm> = new FormGroup<SteuersatzForm>({
    id: new FormControl(0, { nonNullable: true }),
    bezeichnung: new FormControl('', { validators: Validators.required, nonNullable: true }),
    prozentsatz: new FormControl(0, { 
      validators: [Validators.required, Validators.min(0.00001)], 
      nonNullable: true 
    }),
  });

  ngOnInit(): void {
    // Kein manuelles Laden mehr nötig, steuersaetze$ liefert immer aktuellen Zustand
  }

  saveSteuersatz(): void {
    if (this.form.invalid) return;

    const steuersatz: Steuersatz = this.form.getRawValue();

    if (steuersatz.id === 0) {
      this.steuersatzFacade.create(steuersatz).subscribe(() => {
        this.form.reset();
      });
    } else {
      this.steuersatzFacade.update(steuersatz.id, steuersatz).subscribe(() => {
        this.form.reset();
      });
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