import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {

  email: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login() {
    this.authService.login(this.email, this.password)
      .then(() => {
        this.router.navigate(['/clientes']);
      })
      .catch(error => {
        console.error('Error al iniciar sesión:', error);
        alert('Correo o contraseña incorrectos');
      });
  }

  register() {
    if (!this.email || !this.password) {
      alert('Por favor ingresa correo y contraseña');
      return;
    }

    if (this.password.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    this.authService.register(this.email, this.password)
      .then(() => {
        alert('Cuenta creada correctamente');
        this.router.navigate(['/clientes']);
      })
      .catch(error => {
        console.error('Error al registrar:', error);
        alert('No se pudo crear la cuenta');
      });
  }

}