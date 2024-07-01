import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserBranchComponent } from './user-branch.component';

const routes: Routes = [
  {
    path: '',
    component: UserBranchComponent,
    data: {
      title: 'User Branches',
      icon: 'person_pin_circle'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserBranchRoutingModule { }

