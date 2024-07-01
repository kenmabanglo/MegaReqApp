import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewerGuard } from 'src/app/core/guard/viewer.guard';
import { ApprovedComponent } from './approved.component';

const routes: Routes = [
  {
    path: '',
    component: ApprovedComponent,
    canActivateChild:[ViewerGuard],
    data: {
      title: 'Approved List',
      icon: 'list'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApprovedRoutingModule { }
