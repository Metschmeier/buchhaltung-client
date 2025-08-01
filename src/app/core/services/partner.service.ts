import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Partner } from '../types/partner.type'; 

@Injectable({
  providedIn: 'root'
})
export class PartnerService {
  private baseUrl = 'http://localhost:5000/api/partner';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Partner[]> {
    return this.http.get<Partner[]>(this.baseUrl);
  }

  create(partner: Partner): Observable<Partner> {
    return this.http.post<Partner>(this.baseUrl, partner);
  }

  update(id: number, partner: Partner): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, partner);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}