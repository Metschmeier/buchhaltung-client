import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Buchung } from '../types/buchung.type';

@Injectable({
  providedIn: 'root'
})
export class BuchungService {
  private baseUrl = 'http://localhost:5000/api/buchhaltung';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Buchung[]> {
    return this.http.get<Buchung[]>(this.baseUrl);
  }

  getById(id: number): Observable<Buchung> {
    return this.http.get<Buchung>(`${this.baseUrl}/${id}`);
  }

  create(buchung: Buchung): Observable<Buchung> {
    return this.http.post<Buchung>(this.baseUrl, buchung);
  }

  update(id: number, buchung: Buchung): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, buchung);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}