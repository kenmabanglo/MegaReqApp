import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TalentRequisitionComponent } from './talent-requisition.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TalentRequisitionRoutingModule } from './talent-requisition-routing.module';



@NgModule({
  declarations: [
    TalentRequisitionComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    TalentRequisitionRoutingModule
  ],
  exports: [
    TalentRequisitionRoutingModule
  ]
})
export class TalentRequisitionModule { }
