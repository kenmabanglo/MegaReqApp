import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthenticationService } from '../service/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class LoggedInAuthGuard implements CanActivate {

  constructor( private router:Router, 
    private jwtHelper: JwtHelperService,
    private authService: AuthenticationService) { }

  canActivate(): boolean {
    if (this.authService.isUserAuthenticated()) {
        this.router.navigate(['/']);
        return false
    } else {
        return true
    }
}
  
}
