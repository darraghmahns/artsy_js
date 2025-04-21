import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  user$;
  dropdownOpen = false;
  mobileMenuOpen = false;

  constructor(private auth: AuthService) {
    this.user$ = this.auth.user$;
  }

  ngOnInit() {
    document.addEventListener('click', this.onClickOutside);
    document.addEventListener('keydown', this.onEsc);
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.onClickOutside);
    document.removeEventListener('keydown', this.onEsc);
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }

  closeDropdown() {
    this.dropdownOpen = false;
  }

  private onClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown')) {
      this.closeDropdown();
    }
  };

  private onEsc = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      this.closeDropdown();
      this.closeMobileMenu();
    }
  };

  logout() {
    this.auth.logout().subscribe();
  }

  deleteAccount() {
    this.auth.deleteAccount().subscribe();
  }
}
