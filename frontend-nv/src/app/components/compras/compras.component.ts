import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-compras',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.css']
})
export class ComprasComponent {

  compraForm: FormGroup;

  // 🔥 UID (luego lo conectas con Firebase real)
  uidFirebase: string = 'demoUID';

  // 🔥 URL API (LOCAL por ahora)
  apiUrl: string = 'https://rentavideojuegospeliculas-production.up.railway.app/compras';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {

    this.compraForm = this.fb.group({
      tituloJuego: ['', Validators.required],
      precio: [this.generarPrecio(), Validators.required],
      metodoPago: ['', Validators.required],
    });

  }

  // 🎮 Precio random
  generarPrecio(): number {
    return Math.floor(Math.random() * 1000) + 100;
  }

  // 💾 Guardar compra (YA CON API)
  guardarCompra() {

    if (this.compraForm.valid) {

      const form = this.compraForm.value;

      const datos = {
        uid: this.uidFirebase,
        titulo_pelicula: form.tituloJuego,
        precio: form.precio,
        metodo_pago: form.metodoPago
      };

      console.log('Enviando a API:', datos);

      this.http.post(this.apiUrl, datos).subscribe({
        next: (res) => {
          console.log('Respuesta:', res);
          alert('✅ Compra guardada en la BD');

          this.compraForm.reset();
          this.compraForm.patchValue({
            precio: this.generarPrecio()
          });
        },
        error: (err) => {
          console.error(err);
          alert('❌ Error al guardar');
        }
      });

    } else {
      alert('❌ Completa todos los campos');
    }

  }

  regresar() {
    this.router.navigate(['/clientes']);
  }

}