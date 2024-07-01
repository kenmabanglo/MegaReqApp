import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';  
import { Constants } from 'src/app/core/constants/constants'; 
import { UserService } from 'src/app/shared/service/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router:Router, 
    private jwtHelper: JwtHelperService,
    private service: UserService
    ){}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const token = localStorage.getItem(Constants.JWT_KEY);
    const role = this.service.GetRolebyToken(token); 
    //console.log(this.jwtHelper.getTokenExpirationDate(token));
    if (token && !this.jwtHelper.isTokenExpired(token)) { 
      let roles: string[] = route.data['permittedRoles'] as Array<string>;
      //console.log(roles);
      //console.log(role);
      if (role == 'Admin') {
        return true;
      }
      else {
        if (roles) {
          if (this.service.roleMatch(roles)) {
            return true;
          } 
          else {
            this.router.navigate(['/forbidden']); return false;
          }
        }
      }  

      return true;
    }
    // localStorage.clear();
    this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url }});

    return false;
  }
  
}
