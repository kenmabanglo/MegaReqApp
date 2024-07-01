import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FundLiquidationComponent } from './fund-liquidation.component';

const routes: Routes = [
  {
    path: '',
    component: FundLiquidationComponent,
    data: {
      title: 'Fund Liquidation Form',
      icon: 'note_add'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FundLiquidationRoutingModule { }
