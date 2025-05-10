// src/app/services/empreendedor-service.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Empreendedor {
  id?: number;
  empresa: string;
  email: string;
  telefone: string;
  municipio: string;
  estado: string;
  cnpj: string;
  cep: string;
  biografia: string;
  materiais: string[];
  horario: string;
  precoKg?: number;
  precoTonelada?: number;
}

@Injectable({ providedIn: 'root' })
export class EmpreendedorService {
  private base = 'http://localhost:3000/empreendedores';
  constructor(private http: HttpClient) {}

  criar(data: Empreendedor): Observable<Empreendedor> {
    return this.http.post<Empreendedor>(this.base, data);
  }

  login(email: string, senha: string): Observable<Empreendedor[]> {
    return this.http.get<Empreendedor[]>(`${this.base}?email=${email}&senha=${senha}`);
  }

  listarTodos(): Observable<Empreendedor[]> {
    return this.http.get<Empreendedor[]>(this.base);
  }

  atualizar(id: number, data: Partial<Empreendedor>): Observable<Empreendedor> {
    return this.http.patch<Empreendedor>(`${this.base}/${id}`, data);
  }

  getById(id: string | number): Observable<Empreendedor> {
    return this.http.get<Empreendedor>(`${this.base}/${id}`);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
