import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { EmpreendedorService, Empreendedor } from '../../../../services/EmpreendedorService.service';

@Component({
  selector: 'app-home-admin',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './home-admin.component.html'
})
export class HomeAdminComponent implements OnInit {
  profile!: FormGroup;
  form!: FormGroup;
  empreendedor!: Empreendedor;
  saving = false;
  deleting = false;
  message = '';

  constructor(
    private fb: FormBuilder,
    private service: EmpreendedorService,
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const raw = localStorage.getItem('empreendedor');
      if (!raw) {
        this.router.navigate(['/login']);
        return;
      }
      this.empreendedor = JSON.parse(raw);
    }

    this.document.title = `Configurações – ${this.empreendedor.empresa}`;

    // Grupo perfil
    this.profile = this.fb.group({
      empresa:   [this.empreendedor.empresa, Validators.required],
      email:     [this.empreendedor.email, [Validators.required, Validators.email]],
      telefone:  [this.empreendedor.telefone, Validators.required],
      municipio: [this.empreendedor.municipio, Validators.required],
      estado:    [this.empreendedor.estado, Validators.required],
      biografia: [this.empreendedor.biografia],
      horario:   [this.empreendedor.horario, Validators.required]
    });

    // Tabela preços
    const priceCtrls = this.empreendedor.materiais.map(m =>
      this.fb.group({
        material: [m],
        precoKg:  [(this.empreendedor as any)[`preco_${m}_kg`] ?? 0, [Validators.required, Validators.min(0)]],
        precoTon: [(this.empreendedor as any)[`preco_${m}_ton`] ?? 0, [Validators.required, Validators.min(0)]]
      })
    );
    this.form = this.fb.group({ prices: this.fb.array(priceCtrls) });
  }

  get prices(): FormArray {
    return this.form.get('prices') as FormArray;
  }

  onSave(): void {
    if (this.profile.invalid && this.form.invalid) return;
    this.saving = true;

    // junta atualizações de perfil + preços
    const updates: any = { ...this.profile.value };
    this.prices.value.forEach((p: any) => {
      updates[`preco_${p.material}_kg`] = p.precoKg;
      updates[`preco_${p.material}_ton`] = p.precoTon;
    });

    this.service.atualizar(this.empreendedor.id!, updates).subscribe({
      next: emp => {
        // atualiza local e redireciona
        localStorage.setItem('empreendedor', JSON.stringify(emp));
        this.router.navigate(['']);
      },
      error: () => {
        this.saving = false;
        this.message = 'Falha ao salvar. Tente novamente.';
      }
    });
  }

  deleteAccount(): void {
    if (!confirm('Excluir conta?')) return;
    this.deleting = true;
    this.service.excluir(this.empreendedor.id!).subscribe({
      next: () => {
        localStorage.removeItem('empreendedor');
        this.router.navigate(['/']);
      },
      error: () => {
        this.deleting = false;
        this.message = 'Falha ao excluir.';
      }
    });
  }

  logout(): void {
    localStorage.removeItem('empreendedor');
    this.router.navigate(['/login']);
  }
}
