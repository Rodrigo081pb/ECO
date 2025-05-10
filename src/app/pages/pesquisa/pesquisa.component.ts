// src/app/pesquisa/pesquisa.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }  from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EmpreendedorService, Empreendedor } from '../../../../services/EmpreendedorService.service';

@Component({
  selector: 'app-pesquisa',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './pesquisa.component.html',
})
export class PesquisaComponent implements OnInit {
  empreendedores: Empreendedor[] = [];
  filtered:       Empreendedor[] = [];

  estados = [
    'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA',
    'MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN',
    'RS','RO','RR','SC','SP','SE','TO'
  ];
  materiaisList = ['Papel','Plástico','Vidro','Metal','Eletrônicos','Outros'];

  filterEstado   = '';
  filterMaterial = '';

  constructor(private service: EmpreendedorService) {}

  ngOnInit(): void {
    this.service.listarTodos().subscribe(list => {
      this.empreendedores = list;
      this.filtered       = [...list];
    });
  }

  applyFilters(): void {
    this.filtered = this.empreendedores.filter(e => {
      const byEstado   = !this.filterEstado   || e.estado === this.filterEstado;
      const byMaterial = !this.filterMaterial || e.materiais.includes(this.filterMaterial);
      return byEstado && byMaterial;
    });
  }

  whatsappLink(e: Empreendedor): string {
    const digits = (e.telefone || '').replace(/\D+/g, '');
    return `https://wa.me/${digits}`;
  }



}
