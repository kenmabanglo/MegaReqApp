import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApproverGuard } from 'src/app/core/guard';
import { ApprovalHistoryComponent } from './approval-history.component';

const routes: Routes = [
  {
    path: '',
    component: ApprovalHistoryComponent,
    data: {
      permittedRoles:['Approver'],
      title: 'Approval History',
      icon: 'history'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApprovalHistoryRoutingModule { }
