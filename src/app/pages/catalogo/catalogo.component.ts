// catalogo.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EmpreendedorService, Empreendedor } from '../../../../services/EmpreendedorService.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './catalogo.component.html',
})
export class CatalogoComponent implements OnInit {
  empreendedor?: Empreendedor;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private service: EmpreendedorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.service.getById(id).subscribe({
        next: (e) => {
          this.empreendedor = e;
          this.loading = false;
        },
        error: (err) => {
          console.error('Erro ao buscar empreendedor:', err);
          this.loading = false;
        },
      });
    } else {
      this.loading = false;
    }
  }

  get whatsAppLink(): string {
    const tel = this.empreendedor?.telefone ?? '';
    const digits = tel.replace(/\D+/g, '');
    return digits ? `https://wa.me/${digits}` : '';
  }

  back(): void {
    this.router.navigate(['/pesquisa']);
  }
}
