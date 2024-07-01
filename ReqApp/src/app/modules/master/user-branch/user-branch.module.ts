import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserBranchRoutingModule } from './user-branch-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from '../../../shared/material.module';



@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    UserBranchRoutingModule
  ],
  exports: [
    UserBranchRoutingModule
  ]
})
export class UserBranchModule { }
