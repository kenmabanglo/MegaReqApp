import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RejectedHistoryComponent } from './rejected-history.component';

const routes: Routes = [
  {
    path: '',
    component: RejectedHistoryComponent,
    data: {
      permittedRoles:['Approver'],
      title: 'Rejected History',
      icon: 'block'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RejectedHistoryRoutingModule { }
