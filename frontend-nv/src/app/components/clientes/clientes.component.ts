import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ClientesService } from '../../services/clientes.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Cliente } from '../../models/cliente.model';
import { EmailFormatPipe } from '../../pipes/email-format.pipe';
import { User } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, EmailFormatPipe],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  clienteForm: FormGroup;
  clientes$!: Observable<Cliente[]>;
  editingId: string | null = null;
  user$: Observable<User | null>;
  uidFirebase: string = '';

  constructor(
    private fb: FormBuilder,
    private clientesService: ClientesService,
    private authService: AuthService,
    private router: Router
  ) {
    this.user$ = this.authService.user$;

    this.clienteForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(80)]],
      correo: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    // Obtener clientes desde Firebase
  this.authService.user$.subscribe(user => {
  if (user) {
    this.clientes$ = this.clientesService.getClientesPorUsuario(user.uid);
  }
});

    // Obtener UID del usuario actual
    this.authService.user$.subscribe(user => {
      if (user) this.uidFirebase = user.uid;
    });
  }

  onSubmit() {
    if (this.clienteForm.valid) {
      const cliente: Cliente = {
        ...this.clienteForm.value,
        uid_firebase: this.uidFirebase
      };

      if (this.editingId) this.updateCliente(cliente);
      else this.addCliente(cliente);
    } else {
      alert('Por favor completa correctamente el formulario');
    }
  }

  addCliente(cliente: Cliente) {
    this.clientesService.addCliente(cliente)
      .then(() => { alert('✅ Usuario agregado correctamente'); this.resetForm(); })
      .catch(error => { console.error(error); alert('❌ Error al agregar usuario'); });
  }

  updateCliente(cliente: Cliente) {
    if (!this.editingId) return;
    this.clientesService.updateCliente(this.editingId, cliente)
      .then(() => { alert('✅ Usuario actualizado'); this.resetForm(); this.editingId = null; })
      .catch(error => { console.error(error); alert('❌ Error al actualizar usuario'); });
  }

  editCliente(cliente: Cliente) {
    this.editingId = cliente.id || null;
    this.clienteForm.patchValue({
      nombre: cliente.nombre,
      correo: cliente.correo
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteCliente(id: string | undefined) {
    if (!id) return;
    if (confirm('¿Eliminar este usuario?')) {
      this.clientesService.deleteCliente(id)
        .then(() => { alert('✅ Usuario eliminado'); })
        .catch(error => { console.error(error); alert('❌ Error al eliminar usuario'); });
    }
  }

  resetForm() {
    this.clienteForm.reset();
    this.editingId = null;
  }

  logout() {
    this.authService.logout().then(() => this.router.navigate(['/login']));
  }

  irACompras() {
    this.router.navigate(['/compras']);
  }
}