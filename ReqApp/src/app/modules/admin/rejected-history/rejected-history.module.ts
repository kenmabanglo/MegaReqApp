import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RejectedHistoryRoutingModule } from './rejected-history-routing.module';
import { RejectedHistoryComponent } from './rejected-history.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    RejectedHistoryComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RejectedHistoryRoutingModule
  ]
})
export class RejectedHistoryModule { }
