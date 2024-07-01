import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApproverGuard } from 'src/app/core/guard/approver.guard';
import { ApprovalMonitoringComponent } from './approval-monitoring.component';

const routes: Routes = [
  {
    path: '',
    component: ApprovalMonitoringComponent,
    data : {
      permittedRoles: ['Approver'],  
      title: 'Approval Monitoring - Pending Requests',
      icon: 'ballot'
    } 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApprovalMonitoringRoutingModule { }
