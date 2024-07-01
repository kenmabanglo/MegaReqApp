import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AboutRoutingModule } from './about-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AboutComponent } from './about.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    AboutRoutingModule
  ],
  exports:[
    AboutRoutingModule
  ]
})
export class AboutModule { }
