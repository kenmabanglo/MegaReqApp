import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthLayoutComponent } from 'src/app/layout/auth-layout/auth-layout.component';

import { LoginComponent } from './page/login/login.component';
import { RegisterComponent } from './page/register/register.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'login',
        loadChildren: () => import('./page/login/login.module').then((m) => m.LoginModule)
      },
      {
        path: 'register',
        loadChildren: () => import('./page/register/register.module').then((m) => m.RegisterModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
