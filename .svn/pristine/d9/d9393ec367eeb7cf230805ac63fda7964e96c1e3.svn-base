import { AutofillMonitor } from '@angular/cdk/text-field';
import { Injectable } from '@angular/core';
import { CanActivateChild, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';  
import { Constants } from '../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class ApproverGuard implements CanActivateChild {

  constructor(
    private router:Router, 
    private jwtHelper: JwtHelperService,
    ){}

    canActivateChild() {
      var token = localStorage.getItem(Constants.USER_KEY);
      let approver = 0;
      if (token) {
        //var payLoad = JSON.parse(window.atob(token.split('.')[1]));
        var payLoad = JSON.parse(token) || {};
        approver = payLoad.approver;
      }
      // console.log(approver);
      if(approver == 0) {
        this.router.navigate(['/forbidden']);
        return false;
      }

      return true;
    }
  
}
