import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FormComponent } from './form/form.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: '/form-entry',
    pathMatch: 'full'
  },
  {
    path: '',
    children: [
      {
        path: 'form-entry',
        loadChildren: () => 
          import('./form/form.module').then(m => m.FormModule)
      },
      {
        path: 'request-history',
        loadChildren: () => 
          import('./request-history/request-history.module').then(m => m.RequestHistoryModule)
      },
      {
        path: 'talent-requisition',
        loadChildren: () => 
          import('./talent-requisition/talent-requisition.module').then(m => m.TalentRequisitionModule)
      },
      {
        path: 'fund-liquidation',
        loadChildren: () => 
          import('./fund-liquidation/fund-liquidation.module').then(m => m.FundLiquidationModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestRoutingModule { }
