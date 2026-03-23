import { Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { ClientesComponent } from './components/clientes/clientes.component';

import { authGuard } from './guards/auth.guard';

export const routes: Routes = [

  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'clientes',
    component: ClientesComponent,
    canActivate: [authGuard]
  },

  // 🔥 ESTA ES LA QUE TE FALTABA
  {
    path: 'compras',
    loadComponent: () =>
      import('./components/compras/compras.component')
        .then(m => m.ComprasComponent),
    canActivate: [authGuard]
  },

  {
    path: '**',
    redirectTo: '/login'
  }

];