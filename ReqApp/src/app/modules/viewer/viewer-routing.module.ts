import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewerGuard } from 'src/app/core/guard/viewer.guard';
 


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'approved',
       redirectTo:'approved/', pathMatch: 'full'
      },
      {
        path: 'approved/:requestType',
        loadChildren: () => 
          import('./approved/approved.module').then(m => m.ApprovedModule)
      },
      {
        path: 'close-rfp',
        loadChildren: () => 
          import('./approval-closed/approval-closed.module').then(m => m.ApprovalClosedModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewerRoutingModule { }
