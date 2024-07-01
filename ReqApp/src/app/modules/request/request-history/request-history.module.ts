import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequestHistoryRoutingModule } from './request-history-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { RequestHistoryComponent } from './request-history.component';


@NgModule({
  declarations: [
    RequestHistoryComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RequestHistoryRoutingModule
  ],
  exports: [
    RequestHistoryRoutingModule
  ]
})
export class RequestHistoryModule { }
