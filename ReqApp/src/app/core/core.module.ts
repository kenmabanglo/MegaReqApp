import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { JwtModule } from '@auth0/angular-jwt';

import { AuthGuard } from './guard/auth.guard';
import { LoggedInAuthGuard } from './guard/logged-in-auth.guard';
import { AuthInterceptor } from './interceptor/auth.interceptor';

import { AutoLogoutService } from './service/autologout.service';

import { Constants } from './constants/constants';
import { environment } from 'src/environments/environment';
import { ApproverGuard } from './guard/approver.guard';
import { HttpCancelService } from './service/httpcancel.service';
import { ManageHttpInterceptor } from './interceptor/managehttp.interceptor';
import { ViewerGuard } from './guard/viewer.guard';
import { AccountingGuard } from './guard/accounting.guard';

export function tokenGetter() {
  return localStorage.getItem(Constants.JWT_KEY);
}

@NgModule({
  declarations: [ 
  ],
  imports: [ 
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: [environment.baseApiUrl],
        disallowedRoutes: []
      }
    }),
   
  ],
  exports:[ 
  ],
  providers: [
    AuthGuard, 
    LoggedInAuthGuard,
    ApproverGuard,
    ViewerGuard,
    AccountingGuard,
    AutoLogoutService,
    HttpCancelService,
    { 
      provide: HTTP_INTERCEPTORS, 
      useClass: AuthInterceptor, 
      multi: true 
    }
    // { provide: HTTP_INTERCEPTORS, 
    //   useClass: ManageHttpInterceptor, 
    //   multi: true 
    // }
  ],

})
export class CoreModule {} 