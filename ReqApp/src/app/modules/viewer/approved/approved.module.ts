import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApprovedRoutingModule } from './approved-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ApprovedComponent } from './approved.component';


@NgModule({
  declarations: [ApprovedComponent],
  imports: [
    CommonModule,
    SharedModule,
    ApprovedRoutingModule
  ]
})
export class ApprovedModule { }
