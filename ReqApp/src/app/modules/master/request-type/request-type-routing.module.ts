import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequestTypeComponent } from './request-type.component';

const routes: Routes = [
  {
    path: '',
    component: RequestTypeComponent,
    data: {
      title: 'Request Type Master',
      icon: 'note_add'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestTypeRoutingModule { }
