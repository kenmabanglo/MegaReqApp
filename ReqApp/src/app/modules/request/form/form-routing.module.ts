import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormComponent } from './form.component';

const routes: Routes = [
  {
    path: '',
    component: FormComponent,
    data: {
      title: 'Request Form',
      icon: 'note_add'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormRoutingModule { }
