import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { EmpreendedorService } from '../../../../services/EmpreendedorService.service';

interface Estado {
  sigla: string;
  nome: string;
}

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent implements OnInit {
  cadastroForm: FormGroup;
  materiaisList = ['Papel', 'Plástico', 'Vidro', 'Metal', 'Eletrônicos', 'Outros'];
  estados: Estado[] = [
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
    { sigla: 'TO', nome: 'Tocantins' },
  ];

  loading = false;
  sucesso = false;
  errorMsg = '';

  constructor(
    private fb: FormBuilder,
    private empreService: EmpreendedorService,
    private router: Router
  ) {
    this.cadastroForm = this.fb.group({
      empresa:        ['', Validators.required],
      email:          ['', [Validators.required, Validators.email]],
      telefone:       ['', Validators.required],
      senha:          ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', Validators.required],
      municipio:      ['', Validators.required],
      estado:         ['', Validators.required],
      cnpj:           ['', Validators.required],
      cep:            ['', Validators.required],
      biografia:      [''],
      materiais:      [[], Validators.required],
      horario:        ['', Validators.required]
    }, { validators: this.senhasIguais });
  }

  ngOnInit(): void {}

  senhasIguais(group: FormGroup) {
    const s = group.get('senha')?.value;
    const c = group.get('confirmarSenha')?.value;
    return s === c ? null : { mismatch: true };
  }

  toggleMaterial(material: string, checked: boolean): void {
    const control = this.cadastroForm.get('materiais');
    if (!control) return;
    const list: string[] = control.value || [];
    control.setValue(
      checked
        ? [...list, material]
        : list.filter(m => m !== material)
    );
  }

  onSubmit(): void {
    this.cadastroForm.markAllAsTouched();
    console.log('Form válido?', this.cadastroForm.valid, this.cadastroForm.value);
    if (this.cadastroForm.invalid) {
      console.warn('Formulário inválido, abortando submit');
      return;
    }

    this.loading = true;
    const data = { ...this.cadastroForm.value };
    delete data.confirmarSenha;

    this.empreService.criar(data).subscribe({
      next: (res) => {
        console.log('Conta criada com sucesso:', res);
        localStorage.setItem('empreendedor', JSON.stringify(res));
        this.router.navigate(['/super-admin-home']);
      },
      error: (err) => {
        console.error('Erro ao criar conta:', err);
        this.errorMsg = 'Falha ao cadastrar. Tente novamente.';
        this.loading = false;
      }
    });
  }
}
