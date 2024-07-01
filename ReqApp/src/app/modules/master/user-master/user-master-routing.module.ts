import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/guard/auth.guard';
import { UserMasterComponent } from './user-master.component';

const routes: Routes = [
  {
    path: '',
    component: UserMasterComponent,
    canActivate: [AuthGuard],
    data: {
      permittedRoles: ['Admin'], 
      title: 'User Master',
      icon: 'account_circle'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserMasterRoutingModule { }
