import { AutofillMonitor } from '@angular/cdk/text-field';
import { Injectable } from '@angular/core';
import { CanActivateChild, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';  
import { UserService } from 'src/app/shared/service';
import { Constants } from '../constants/constants';
import { AuthenticationService } from '../service';
import { viewers } from './viewer_list';
@Injectable({
  providedIn: 'root'
})
export class ViewerGuard implements CanActivateChild {
  user: any;
  constructor(
    private router:Router, 
    private jwtHelper: JwtHelperService,
    public authenticationService: AuthenticationService,
    public userService: UserService,
    ){
      this.authenticationService.user.subscribe(x => this.user = x);
    }

    canActivateChild() {
      //console.log('ViewerGuard');
      var token = localStorage.getItem(Constants.USER_KEY);
      let userName = '';
      if (token) { 
        var payLoad = JSON.parse(token) || {};
        userName = payLoad.userName;
      }
      // console.log(userName);
      // if(!viewers.includes(userName)) {

    let rights; 
    this.userService.getUserRights(this.user.userName)
    .subscribe(
      (data)=> {
        rights = data; 

        if (!rights.includes('VA')) {
          this.router.navigate(['/forbidden']);
          // console.log('viewer not');
          return false;
        }

      }
    );

    
      // console.log('viewer activated');
      return true;
    }
  
}
