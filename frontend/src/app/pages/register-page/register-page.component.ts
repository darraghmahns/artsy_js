import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register-page.component.html'
})
export class RegisterPageComponent {
  form: FormGroup;
  emailTaken = false;

  constructor(private fb: NonNullableFormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      fullname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.form.get('email')?.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      filter(() => !!this.form.get('email')?.valid)
    ).subscribe(email => this.checkEmailExists(email));
  }

  checkEmailExists(email: string) {
    this.auth.checkEmailExists(email).subscribe({
      next: (res) => this.emailTaken = res.exists,
      error: err => this.emailTaken = false
    });
  }

  submit() {
    if (this.form.invalid || this.emailTaken) return;
    this.auth.register(this.form.getRawValue()).subscribe({
      next: () => this.router.navigateByUrl('/'),
      error: err => alert('Registration failed')
    });
  }
}