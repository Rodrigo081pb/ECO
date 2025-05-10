import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { EmpreendedorService, Empreendedor } from '../../../../services/EmpreendedorService.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private service: EmpreendedorService,
    private router: Router,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.document.title = 'Login – Econnect';
    this.loginForm = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      senha:    ['', [Validators.required, Validators.minLength(6)]],
      remember: [false]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;
    this.loading = true;
    this.error = '';

    const { email, senha, remember } = this.loginForm.value;
    const start = Date.now();

    this.service.login(email, senha).subscribe({
      next: users => {
        if (users.length === 0) {
          this.error = 'Email ou senha incorretos.';
          this.loading = false;
          return;
        }
        const emp: Empreendedor = users[0];
        const delay = Math.max(0, 3000 - (Date.now() - start));

        setTimeout(() => {
          // Armazenamento condicional
          if (remember) {
            localStorage.setItem('empreendedor', JSON.stringify(emp));
          } else {
            sessionStorage.setItem('empreendedor', JSON.stringify(emp));
          }
          this.router.navigate(['/admin-eco']);
        }, delay);
      },
      error: () => {
        this.error = 'Erro ao conectar. Tente novamente.';
        this.loading = false;
      }
    });
  }
}
