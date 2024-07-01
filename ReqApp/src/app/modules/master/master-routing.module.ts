import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/guard';

const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: '/master/request-type',
  //   pathMatch: 'full'
  // },
  {
    path: '',
    children: [
      // {
      //   path: 'request-type',
      //   loadChildren: () => 
      //     import('./request-type/request-type.module').then(m => m.RequestTypeModule)
      // },
      {
        path: 'user-list',
       redirectTo:'user-list/', pathMatch: 'full'
      },
      {
        path: 'user-list/:status', 
        loadChildren: () => 
          import('./user-master/user-master.module').then(m => m.UserMasterModule)
      },
      {
        path: 'user-profile',
        loadChildren: () => 
          import('./user-profile/user-profile.module').then(m => m.UserProfileModule)
      }, 
      {
        path: 'user-approver',
        loadChildren: () => 
          import('./user-approver/user-approver.module').then(m => m.UserApproverModule)
      }, 
      // {
      //   path: 'add-user-workstation',
      //   loadChildren: () =>
      //     import('./user-workstation/user-workstation.module').then(m => m.UserWorkstationModule)
      // }
       {
         path: 'user-branch',
         loadChildren: () =>
           import('./user-branch/user-branch.module').then(m => m.UserBranchModule)
       }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterRoutingModule { }
