import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Kostenstelle } from '../types/kostenstelle.types'; 

@Injectable({
  providedIn: 'root'
})
export class KostenstelleService {
  private baseUrl = 'http://localhost:5000/api/kostenstelle';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Kostenstelle[]> {
    return this.http.get<Kostenstelle[]>(this.baseUrl);
  }

  create(kostenstelle: Kostenstelle): Observable<Kostenstelle> {
    return this.http.post<Kostenstelle>(this.baseUrl, kostenstelle);
  }

  update(id: number, kostenstelle: Kostenstelle): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, kostenstelle);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}