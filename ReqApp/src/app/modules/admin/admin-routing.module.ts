import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApproverGuard } from 'src/app/core/guard/approver.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/approver/approval-monitoring',
    pathMatch: 'full', 
  },
  {
    path: '',  
    children: [
      {
        path: 'approval-monitoring',
        loadChildren: () => 
          import('./approval-monitoring/approval-monitoring.module').then(m => m.ApprovalMonitoringModule)
      },
      {
        path: 'approval-history',
        loadChildren: () => 
          import('./approval-history/approval-history.module').then(m => m.ApprovalHistoryModule)
      },
      {
        path: 'rejected-history',
        loadChildren: () => 
          import('./rejected-history/rejected-history.module').then(m => m.RejectedHistoryModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
