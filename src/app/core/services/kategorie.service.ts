import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Kategorie } from '../types/kategorie.type'; 

@Injectable({
  providedIn: 'root'
})
export class KategorieService {
  private baseUrl = 'http://localhost:5000/api/kategorie';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Kategorie[]> {
    return this.http.get<Kategorie[]>(this.baseUrl);
  }

  create(kategorie: Kategorie): Observable<Kategorie> {
    return this.http.post<Kategorie>(this.baseUrl, kategorie);
  }

  update(id: number, kategorie: Kategorie): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, kategorie);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}