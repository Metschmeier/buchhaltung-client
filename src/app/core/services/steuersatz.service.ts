import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Steuersatz } from '../types/steuersatz.type'; 

@Injectable({
  providedIn: 'root'
})
export class SteuersatzService {
  private baseUrl = 'http://localhost:5000/api/steuersatz';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Steuersatz[]> {
    return this.http.get<Steuersatz[]>(this.baseUrl);
  }

  create(steuersatz: Steuersatz): Observable<Steuersatz> {
    return this.http.post<Steuersatz>(this.baseUrl, steuersatz);
  }

  update(id: number, steuersatz: Steuersatz): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, steuersatz);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}