import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequestHistoryComponent } from './request-history.component';

const routes: Routes = [
  {
    path: '',
    component: RequestHistoryComponent,
    data: {
      title: 'Request History',
      icon: 'history'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestHistoryRoutingModule { }
