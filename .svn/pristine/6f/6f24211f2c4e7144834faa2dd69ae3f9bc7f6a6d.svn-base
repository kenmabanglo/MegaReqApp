import { AutofillMonitor } from '@angular/cdk/text-field';
import { Injectable } from '@angular/core';
import { CanActivateChild, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';  
import { Constants } from '../constants/constants';
import { viewers } from './viewer_list';
@Injectable({
  providedIn: 'root'
})
export class AccountingGuard implements CanActivateChild {

  constructor(
    private router:Router, 
    private jwtHelper: JwtHelperService,
    ){
      console.log('hey');
    }

    canActivateChild() {
      console.log('hey');
      var token = localStorage.getItem(Constants.USER_KEY);
      let userName = ''; let positionName = '';
      let approver = 0;
      if (token) { 
        var payLoad = JSON.parse(token) || {};
        userName = payLoad.userName; 
        approver = payLoad.approver;
      }
      console.log(viewers.includes(userName), approver == 0);
      if(!viewers.includes(userName) && approver == 0) {
        this.router.navigate(['/forbidden']);
        return false;
      }

      return true;
    }
  
}
