import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
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
  styleUrls: ['./partner.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class PartnerComponent implements OnInit {
  private partnerFacade = inject(PartnerFacade);

  partners$ = this.partnerFacade.partners$;

  form: FormGroup<PartnerForm> = new FormGroup<PartnerForm>({
    id: new FormControl(0, { nonNullable: true }),
    kontonummer: new FormControl('', { validators: Validators.required, nonNullable: true }),
    name: new FormControl('', { validators: Validators.required, nonNullable: true }),
    typ: new FormControl('', { validators: Validators.required, nonNullable: true }),
    adresse: new FormControl('', { validators: Validators.required, nonNullable: true }),
    eMail: new FormControl('', { validators: Validators.email, nonNullable: true })
  });

  ngOnInit(): void {
    // Kein manuelles Laden nötig, da partners$ Observable im Template genutzt wird
  }

  savePartner(): void {
    if (this.form.invalid) return;

    const partner: Partner = this.form.getRawValue();

    if (partner.id === 0) {
      this.partnerFacade.create(partner).subscribe(() => {
        this.form.reset();
      });
    } else {
      this.partnerFacade.update(partner.id, partner).subscribe(() => {
        this.form.reset();
      });
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