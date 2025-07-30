import { TestBed } from '@angular/core/testing';
import { PartnerService } from './partner.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('PartnerService', () => {
  let service: PartnerService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PartnerService]
    });
    service = TestBed.inject(PartnerService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should fetch all partners', () => {
    const mockData = [{ id: 1, name: 'Test', kontonummer: 'X', typ: '', adresse: '', eMail: '' }];

    service.getAll().subscribe(data => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne('https://localhost:5001/api/partner');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should create a partner (POST)', () => {
    const newPartner = { id: 0, name: 'New', kontonummer: '123', typ: '', adresse: '', eMail: '' };

    service.create(newPartner).subscribe(response => {
      expect(response).toEqual(newPartner);
    });

    const req = httpMock.expectOne('https://localhost:5001/api/partner');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newPartner);
    req.flush(newPartner);
  });

  it('should update a partner (PUT)', () => {
    const updatedPartner = { id: 1, name: 'Updated', kontonummer: '456', typ: '', adresse: '', eMail: '' };

    it('should update a partner (PUT)', () => {
  const updatedPartner = { id: 1, name: 'Updated', kontonummer: '456', typ: '', adresse: '', eMail: '' };

  service.update(updatedPartner.id, updatedPartner).subscribe(response => {
    expect(response).toBeUndefined();
  });

  const req = httpMock.expectOne(`https://localhost:5001/api/partner/${updatedPartner.id}`);
  expect(req.request.method).toBe('PUT');
  expect(req.request.body).toEqual(updatedPartner);
  req.flush({});
});

    const req = httpMock.expectOne(`https://localhost:5001/api/partner/${updatedPartner.id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedPartner);
    req.flush({}); // Statt null -> {}
  });

  it('should delete a partner (DELETE)', () => {
    const id = 1;

    service.delete(id).subscribe(response => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(`https://localhost:5001/api/partner/${id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({}); // Statt null -> {}
  });

  afterEach(() => {
    httpMock.verify();
  });
});