import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PartnerService } from '../../core/services/partner.service';
import { Partner } from '../../core/types/partner.type';

@Component({
  selector: 'app-partner',
  standalone: true,
  templateUrl: './partner.component.html',
  imports: [CommonModule, FormsModule]
})
export class PartnerComponent implements OnInit {
  partners: Partner[] = [];
  selectedPartner: Partner = this.createEmptyPartner();

  constructor(private partnerService: PartnerService) {}

  ngOnInit(): void {
    this.loadPartners();
  }

  loadPartners(): void {
    this.partnerService.getAll().subscribe(data => {
      this.partners = data;
    });
  }

  createEmptyPartner(): Partner {
    return {
      id: 0,
      kontonummer: '',
      name: '',
      typ: '',
      adresse: '',
      eMail: ''
    };
  }

  savePartner(): void {
    if (this.selectedPartner.id === 0) {
      this.partnerService.create(this.selectedPartner).subscribe(() => {
        this.loadPartners();
        this.selectedPartner = this.createEmptyPartner();
      });
    } else {
      this.partnerService.update(this.selectedPartner.id, this.selectedPartner).subscribe(() => {
        this.loadPartners();
        this.selectedPartner = this.createEmptyPartner();
      });
    }
  }

  editPartner(partner: Partner): void {
    this.selectedPartner = { ...partner };
  }

  deletePartner(id: number): void {
    if (confirm('Wirklich löschen?')) {
      this.partnerService.delete(id).subscribe(() => {
        this.loadPartners();
        if (this.selectedPartner.id === id) {
          this.selectedPartner = this.createEmptyPartner();
        }
      });
    }
  }

  cancelEdit(): void {
    this.selectedPartner = this.createEmptyPartner();
  }
}