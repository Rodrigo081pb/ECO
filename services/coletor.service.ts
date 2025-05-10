import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Coletor {
  id?: number;
  sexo: string;
  estado: string;
  idade: number;
  timestamp?: string;
}

@Injectable({ providedIn: 'root' })
export class ColetorService {
  private base = 'http://localhost:3000/api/coletores';
  constructor(private http: HttpClient) {}

  criar(data: Coletor): Observable<Coletor> {
    return this.http.post<Coletor>(this.base, data);
  }

  listar(): Observable<Coletor[]> {
    return this.http.get<Coletor[]>(this.base);
  }
}
