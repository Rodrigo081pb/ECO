// src/app/navbar/navbar.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger,
} from '@angular/animations';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  animations: [
    // 1) slide down on enter
    trigger('slideDown', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)', opacity: 0 }),
        animate('400ms ease-out', style({ transform: 'translateY(0)', opacity: 1 })),
      ]),
    ]),
    // 2) stagger links
    trigger('staggerLinks', [
      transition(':enter', [
        query(
          'a, button',
          [
            style({ opacity: 0, transform: 'translateY(-10px)' }),
            stagger(100, [
              animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
            ]),
          ],
          { optional: true }
        ),
      ]),
    ]),
  ],
})
export class NavbarComponent {
  mobileMenu = false;

  toggleMenu(): void {
    this.mobileMenu = !this.mobileMenu;
  }
}
