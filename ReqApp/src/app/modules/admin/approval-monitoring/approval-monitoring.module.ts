import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApprovalMonitoringRoutingModule } from './approval-monitoring-routing.module';
import { ApprovalMonitoringComponent } from './approval-monitoring.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ApprovalMonitoringComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ApprovalMonitoringRoutingModule
  ],
  exports: [
    ApprovalMonitoringRoutingModule
  ]
})
export class ApprovalMonitoringModule { }
