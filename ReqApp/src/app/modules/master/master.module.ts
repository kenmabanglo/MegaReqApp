import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterRoutingModule } from './master-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { UserMasterComponent } from './user-master/user-master.component'; 
import { RequestTypeComponent } from './request-type/request-type.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserWorkstationComponent } from './user-workstation/user-workstation.component';
import { UserApproverComponent } from './user-approver/user-approver.component';
import { UserBranchComponent } from './user-branch/user-branch.component';


@NgModule({
  declarations: [
    UserMasterComponent,
    UserProfileComponent, 
    RequestTypeComponent,
    UserWorkstationComponent,
    UserApproverComponent,
    UserBranchComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MasterRoutingModule,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class MasterModule { }
