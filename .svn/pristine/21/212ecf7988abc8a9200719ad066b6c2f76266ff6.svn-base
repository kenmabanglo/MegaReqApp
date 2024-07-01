import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Constants } from 'src/app/core/constants/constants'; 
import { User } from 'src/app/shared/interface/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;
 

  constructor(
      private router: Router,
      private http: HttpClient,
      private jwtHelper: JwtHelperService,
      private dialogRef: MatDialog
  ) {
      let token = localStorage.getItem(Constants.USER_KEY);
      // let userInfo: any={}; 
      // if (token) {
      //   userInfo =  JSON.parse(window.atob(token.split('.')[1])); 
      // }    
      
      this.userSubject = new BehaviorSubject<User>(JSON.parse(token) || {});
      
      this.user = this.userSubject.asObservable();
  }

  public get userValue(): User {
      return this.userSubject.value;
  }

  login(data: any) {
      return this.http.post<any>(`${environment.baseApiUrl}User/Login`, data)
          .pipe(map(user => {
              if (user.responseCode == 1) {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem(Constants.USER_KEY,JSON.stringify(user.dataSet));
                const token = user.dataSet.token;
                localStorage.setItem(Constants.JWT_KEY,token);
                  console.log('authenticated');
              //  this.router.navigate(["/"]); 
  
                this.userSubject.next(user.dataSet); 
              }   
             
              return user;
          }));
  }
  isUserAuthenticated = (): boolean => {
    const token = localStorage.getItem(Constants.JWT_KEY);
   // console.log(this.jwtHelper.getTokenExpirationDate(token));
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      return true;
    }

    return false;
  }
  logout() {
      // remove user from local storage to log user out
      // localStorage.clear();
      localStorage.removeItem(Constants.USER_KEY);
      localStorage.removeItem(Constants.JWT_KEY);
      localStorage.removeItem("lastAction");

      
      this.dialogRef.closeAll();

      // localStorage.removeItem('');
      this.userSubject.next(null!);
      this.router.navigate(['/auth/login']);
  }
}
