// src/app/pages/home-admin/home-admin.component.ts

import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { EmpreendedorService, Empreendedor } from '../../../../services/EmpreendedorService.service';

@Component({
  selector: 'app-home-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './home-admin.component.html'
})
export class HomeAdminComponent implements OnInit {
  profile!: FormGroup;
  form!: FormGroup;
  empreendedor!: Empreendedor;
  saving = false;
  deleting = false;
  editing = false;

  // Dias da semana para seleção
  diasSemana: string[] = [
    'Segunda-feira', 'Terça-feira', 'Quarta-feira',
    'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'
  ];

  // Lista de estados brasileiros
  brazilianStates = [
    { sigla: 'AC', nome: 'Acre' },
    { sigla: 'AL', nome: 'Alagoas' },
    { sigla: 'AP', nome: 'Amapá' },
    { sigla: 'AM', nome: 'Amazonas' },
    { sigla: 'BA', nome: 'Bahia' },
    { sigla: 'CE', nome: 'Ceará' },
    { sigla: 'DF', nome: 'Distrito Federal' },
    { sigla: 'ES', nome: 'Espírito Santo' },
    { sigla: 'GO', nome: 'Goiás' },
    { sigla: 'MA', nome: 'Maranhão' },
    { sigla: 'MT', nome: 'Mato Grosso' },
    { sigla: 'MS', nome: 'Mato Grosso do Sul' },
    { sigla: 'MG', nome: 'Minas Gerais' },
    { sigla: 'PA', nome: 'Pará' },
    { sigla: 'PB', nome: 'Paraíba' },
    { sigla: 'PR', nome: 'Paraná' },
    { sigla: 'PE', nome: 'Pernambuco' },
    { sigla: 'PI', nome: 'Piauí' },
    { sigla: 'RJ', nome: 'Rio de Janeiro' },
    { sigla: 'RN', nome: 'Rio Grande do Norte' },
    { sigla: 'RS', nome: 'Rio Grande do Sul' },
    { sigla: 'RO', nome: 'Rondônia' },
    { sigla: 'RR', nome: 'Roraima' },
    { sigla: 'SC', nome: 'Santa Catarina' },
    { sigla: 'SP', nome: 'São Paulo' },
    { sigla: 'SE', nome: 'Sergipe' },
    { sigla: 'TO', nome: 'Tocantins' }
  ];

  constructor(
    private fb: FormBuilder,
    private service: EmpreendedorService,
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  ngOnInit(): void {
    // Recupera dados do empreendedor do localStorage
    if (isPlatformBrowser(this.platformId)) {
      const raw = localStorage.getItem('empreendedor');
      if (!raw) {
        this.router.navigate(['/login']);
        return;
      }
      this.empreendedor = JSON.parse(raw);
    }

    // Define o título da página
    this.document.title = `Configurações – ${this.empreendedor.empresa}`;

    // Inicializa FormGroup de perfil
    this.profile = this.fb.group({
      empresa:    [this.empreendedor.empresa, Validators.required],
      email:      [this.empreendedor.email, [Validators.required, Validators.email]],
      telefone:   [this.empreendedor.telefone, Validators.required],
      municipio:  [this.empreendedor.municipio, Validators.required],
      estado:     [this.empreendedor.estado, Validators.required],
      biografia:  [this.empreendedor.biografia],
      diaInicio:  ['Segunda-feira', Validators.required],
      diaFim:     ['Sexta-feira', Validators.required],
      horaInicio: ['08:00', Validators.required],
      horaFim:    ['19:00', Validators.required],
      horario:    ['', Validators.required]
    });

    // Preenche inicialmente o campo concatenado
    this.updateHorario();
    this.profile.disable();

    // Atualiza 'horario' sempre que qualquer parte do horário mudar
    ['diaInicio', 'diaFim', 'horaInicio', 'horaFim'].forEach(key => {
      this.profile.get(key)!.valueChanges.subscribe(() => this.updateHorario());
    });

    // Inicializa FormArray de preços, lendo o campo correto `_tonelada`
    const priceCtrls = this.empreendedor.materiais.map(m =>
      this.fb.group({
        material: [m, Validators.required],
        precoKg:  [(this.empreendedor as any)[`preco_${m}_kg`] ?? 0, [Validators.required, Validators.min(0)]],
        precoTon: [(this.empreendedor as any)[`preco_${m}_tonelada`] ?? 0, [Validators.required, Validators.min(0)]]
      })
    );
    this.form = this.fb.group({ prices: this.fb.array(priceCtrls) });
    this.form.disable();
  }

  get prices(): FormArray {
    return this.form.get('prices') as FormArray;
  }

  // Ativa o modo de edição
  startEdit(): void {
    this.editing = true;
    this.profile.enable();
    this.form.enable();
  }

  // Concatena e atualiza o campo 'horario'
  private updateHorario(): void {
    const di = this.profile.get('diaInicio')!.value;
    const df = this.profile.get('diaFim')!.value;
    const hi = this.profile.get('horaInicio')!.value;
    const hf = this.profile.get('horaFim')!.value;
    const texto = `De ${di} a ${df}, das ${hi} às ${hf}`;
    this.profile.get('horario')!.setValue(texto, { emitEvent: false });
  }

  addMaterial(): void {
    this.prices.push(
      this.fb.group({
        material: ['', Validators.required],
        precoKg:  [0, [Validators.required, Validators.min(0)]],
        precoTon: [0, [Validators.required, Validators.min(0)]]
      })
    );
  }

  removeMaterial(index: number): void {
    this.prices.removeAt(index);
  }

  // Método onSave completo e atualizado
  onSave(): void {
    if (this.profile.invalid || this.form.invalid) {
      return;
    }
    this.saving = true;

    // Monta o objeto de updates com todos os campos do perfil
    const updates: any = { ...this.profile.value };

    // Adiciona dinamicamente os preços por material
    this.prices.value.forEach((p: any) => {
      updates[`preco_${p.material}_kg`]       = p.precoKg;
      updates[`preco_${p.material}_tonelada`] = p.precoTon;
    });

    // Executa o PUT para atualizar o empreendedor
    this.service.atualizar(this.empreendedor.id!, updates).subscribe({
      next: (res) => {
        // 1) Atualiza o objeto em memória com a resposta do servidor
        this.empreendedor = res;
        // 2) Persiste o objeto atualizado no localStorage
        localStorage.setItem('empreendedor', JSON.stringify(res));

        alert('Todas as informações foram salvas com sucesso!');

        // Desativa o modo de edição e o form
        this.editing = false;
        this.profile.disable();
        this.form.disable();

        // Redireciona para a rota principal (ou recarrega)
        this.router.navigate(['']);
      },
      error: () => {
        this.saving = false;
        alert('Falha ao salvar. Tente novamente.');
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
        alert('Falha ao excluir.');
      }
    });
  }

  logout(): void {
    localStorage.removeItem('empreendedor');
    this.router.navigate(['/login']);
  }
}
