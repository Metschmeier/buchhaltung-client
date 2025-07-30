import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PartnerService } from '../../core/services/partner.service';
import { Partner } from '../../core/types/partner.type';

@Component({
  selector: 'app-partner',
  standalone: true,
  templateUrl: './partner.component.html',
  styleUrls: ['./partner.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class PartnerComponent implements OnInit {
  partners: Partner[] = [];
  form: FormGroup;

  constructor(private partnerService: PartnerService, private fb: FormBuilder) {
    this.form = this.fb.group({
      id: [0],
      kontonummer: ['', Validators.required],
      name: ['', Validators.required],
      typ: [''],
      adresse: [''],
      eMail: ['', [Validators.email]]
    });
  }

  ngOnInit(): void {
    this.loadPartners();
  }

  loadPartners(): void {
    this.partnerService.getAll().subscribe(data => {
      this.partners = data;
    });
  }

  savePartner(): void {
    if (this.form.invalid) return;

    const partner: Partner = this.form.value;

    if (partner.id === 0) {
      this.partnerService.create(partner).subscribe(() => {
        this.loadPartners();
        this.resetForm();
      });
    } else {
      this.partnerService.update(partner.id, partner).subscribe(() => {
        this.loadPartners();
        this.resetForm();
      });
    }
  }

  editPartner(partner: Partner): void {
    this.form.setValue({ ...partner });
  }

  deletePartner(id: number): void {
    if (confirm('Wirklich löschen?')) {
      this.partnerService.delete(id).subscribe(() => {
        this.loadPartners();
        if (this.form.value.id === id) {
          this.resetForm();
        }
      });
    }
  }

  resetForm(): void {
    this.form.reset({
      id: 0,
      kontonummer: '',
      name: '',
      typ: '',
      adresse: '',
      eMail: ''
    });
  }
}