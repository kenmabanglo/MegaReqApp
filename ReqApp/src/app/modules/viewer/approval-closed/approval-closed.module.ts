import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApprovalClosedRoutingModule } from './approval-closed-routing.module';
import { ApprovalClosedComponent } from './approval-closed.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ApprovalClosedComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ApprovalClosedRoutingModule
  ],
  exports: [
    ApprovalClosedRoutingModule
  ]
})
export class ApprovalClosedModule { }
