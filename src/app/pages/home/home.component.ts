import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ColetorService, Coletor } from '../../../../services/coletor.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  showModal = false;
  etapa = 0;
  darkMode = false;
  mobileMenu = false;

  sexo = '';
  estado = '';
  idade!: number;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private coletorService: ColetorService
  ) {}

  ngOnInit(): void {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.darkMode = stored === 'dark' || (!stored && prefersDark);
    this.document.documentElement.classList.toggle('dark', this.darkMode);
  }

  openModal(): void {
    this.showModal = true;
    this.etapa = 0;
  }

  closeModal(): void {
    this.showModal = false;
  }

  selecionar(op: string): void {
    if (op === 'visitante') {
      // Apenas navega
      this.closeModal();
      this.router.navigate(['/pesquisa']);
    } else if (op === 'coletor') {
      this.etapa = 1;
    } else if (op === 'empreendedor') {
      this.closeModal();
      this.router.navigate(['/cadastro']);
    }
  }

  goToPesquisa(): void {
    // Cria registro de coletor no mock API
    const novo: Coletor = {
      sexo: this.sexo,
      estado: this.estado,
      idade: this.idade,
      timestamp: new Date().toISOString()
    };
    this.coletorService.criar(novo).subscribe({
      next: () => {
        this.closeModal();
        this.router.navigate(['/pesquisa']);
      },
      error: err => {
        console.error('Erro ao salvar coletor', err);
        this.closeModal();
        this.router.navigate(['/pesquisa']);
      }
    });
  }

  toggleMenu(): void {
    this.mobileMenu = !this.mobileMenu;
  }

  toggleDark(): void {
    this.darkMode = !this.darkMode;
    localStorage.setItem('theme', this.darkMode ? 'dark' : 'light');
    this.document.documentElement.classList.toggle('dark', this.darkMode);
  }
}
