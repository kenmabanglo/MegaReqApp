import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserProfileRoutingModule } from './user-profile-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { UserProfileComponent } from './user-profile.component';


@NgModule({
  declarations: [
    // UserProfileComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    UserProfileRoutingModule
  ],
  exports:[UserProfileRoutingModule]
})
export class UserProfileModule { }
