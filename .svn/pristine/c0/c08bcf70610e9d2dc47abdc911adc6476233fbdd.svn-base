import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApproverGuard } from 'src/app/core/guard';
import { AccountingGuard } from 'src/app/core/guard/accounting.guard';
import { ViewerGuard } from 'src/app/core/guard/viewer.guard';
import { ApprovalClosedComponent } from './approval-closed.component';

const routes: Routes = [
  {
    path: '',
    canActivateChild: [ViewerGuard],
    component: ApprovalClosedComponent,
    data: {
      title: 'Closed Requests',
      icon: 'lock'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApprovalClosedRoutingModule { }
