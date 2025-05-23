// src/app/services/empreendedor-service.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environment';

export interface Empreendedor {
  id?: number;
  empresa: string;
  email: string;
  senha: string;           // marcar como opcional
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
  // adiciona /empreendedores/empreendedores
  private base = `${environment.apiUrl}/empreendedores/empreendedores`;

  constructor(private http: HttpClient) {}

  criar(data: Empreendedor): Observable<Empreendedor> {
    return this.http.post<Empreendedor>(this.base, data);
  }

  login(email: string, senha: string): Observable<Empreendedor[]> {
    return this.http.get<Empreendedor[]>(
      `${this.base}?email=${encodeURIComponent(email)}&senha=${encodeURIComponent(senha)}`
    );
  }

  listarTodos(): Observable<Empreendedor[]> {
    return this.http.get<Empreendedor[]>(this.base);
  }

  atualizar(id: number, data: Partial<Empreendedor>): Observable<Empreendedor> {
    return this.http.put<Empreendedor>(`${this.base}/${id}`, data);
  }

  getById(id: string | number): Observable<Empreendedor> {
    return this.http.get<Empreendedor>(`${this.base}/${id}`);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
