import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PartnerComponent } from './partner.component'; // dein standalone component
import { PartnerService } from '../../core/services/partner.service';
import { of } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('PartnerComponent', () => {
  let component: PartnerComponent;
  let fixture: ComponentFixture<PartnerComponent>;
  let partnerServiceSpy: jasmine.SpyObj<PartnerService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('PartnerService', ['getAll', 'create', 'update', 'delete']);

    await TestBed.configureTestingModule({
      imports: [PartnerComponent, FormsModule, ReactiveFormsModule], // Standalone Komponente in imports
      providers: [{ provide: PartnerService, useValue: spy }],
    }).compileComponents();

    partnerServiceSpy = TestBed.inject(PartnerService) as jasmine.SpyObj<PartnerService>;
    fixture = TestBed.createComponent(PartnerComponent);
    component = fixture.componentInstance;
  });

  it('should call loadPartners on init', () => {
    partnerServiceSpy.getAll.and.returnValue(of([]));
    fixture.detectChanges(); // ngOnInit wird ausgelöst
    expect(partnerServiceSpy.getAll).toHaveBeenCalled();
  });

  it('form should be invalid when name and kontonummer are empty', () => {
    fixture.detectChanges();
    component.form.controls['name'].setValue('');
    component.form.controls['kontonummer'].setValue('');
    expect(component.form.valid).toBeFalse();
  });

  it('form should be valid with correct values', () => {
    fixture.detectChanges();
    component.form.controls['name'].setValue('Test Name');
    component.form.controls['kontonummer'].setValue('12345');
    component.form.controls['typ'].setValue('Test Typ');
    component.form.controls['adresse'].setValue('Test Adresse');
    component.form.controls['eMail'].setValue('test@example.com');
    expect(component.form.valid).toBeTrue();
  });

  it('should call create when saving a new partner (id === 0)', () => {
    partnerServiceSpy.create.and.returnValue(of({ id: 1, name: '', kontonummer: '', typ: '', adresse: '', eMail: '' }));
    component.form.controls['id'].setValue(0);
    component.form.controls['name'].setValue('Test');
    component.form.controls['kontonummer'].setValue('123');
    fixture.detectChanges();

    component.savePartner();

    expect(partnerServiceSpy.create).toHaveBeenCalled();
  });

  it('should fill form when editPartner is called', () => {
    const partner = { id: 1, name: 'Edit Name', kontonummer: '123', typ: 'Typ', adresse: 'Adr', eMail: 'mail@test.de' };
    component.editPartner(partner);
    expect(component.form.controls['name'].value).toBe('Edit Name');
    expect(component.form.controls['kontonummer'].value).toBe('123');
  });

  it('should call deletePartner and service.delete', () => {
    partnerServiceSpy.delete.and.returnValue(of(undefined));
    component.deletePartner(1);
    expect(partnerServiceSpy.delete).toHaveBeenCalledWith(1);
  });
});