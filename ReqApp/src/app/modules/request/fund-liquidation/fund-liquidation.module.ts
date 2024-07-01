import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FundLiquidationRoutingModule } from './fund-liquidation-routing.module';
import { FundLiquidationComponent } from './fund-liquidation.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    FundLiquidationComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FundLiquidationRoutingModule
  ],
  exports: [
    FundLiquidationRoutingModule
  ]
})
export class FundLiquidationModule { }
