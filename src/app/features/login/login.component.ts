import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { AuthFacade } from '../../core/facades/auth.facade';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private authService = inject(AuthService);
  private authFacade = inject(AuthFacade);
  private router = inject(Router);

  form: FormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  errorMessage: string | null = null;

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.form.invalid) return;

    const { username, password } = this.form.value;

    this.authService.login(username, password).subscribe({
      next: (response) => {
        this.authFacade.login(response.token);
        this.errorMessage = null;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        if (err.status === 401) {
          this.errorMessage = 'Benutzername oder Passwort ist falsch.';
        } else {
          this.errorMessage = 'Ein Fehler ist aufgetreten. Bitte versuche es später erneut.';
        }
      }
    });
  }
}