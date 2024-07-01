import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { catchError, tap } from "rxjs/operators"; 
import { Constants } from '../constants/constants';
import { NotificationService } from 'src/app/shared/service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private notif: NotificationService
    ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // console.log('running');
    let token=localStorage.getItem(Constants.JWT_KEY);
    // let token = ;
    // console.log(token);
    if (token != null) {
      const clonedReq = req.clone({
          headers: req.headers.set('Authorization', 'Bearer ' + token)
      });
      return next.handle(clonedReq).pipe(
          tap(
              succ => { },
              err => {
                console.log(err);

                  if (err.status == 401){
                      // localStorage.clear();
                      localStorage.removeItem(Constants.JWT_KEY);
                      this.router.navigateByUrl('/auth/login');
                  }
                  else if(err.status == 403) {
                    this.router.navigateByUrl('/forbidden');
                  }
                  else if(err.status == 0) {
                    this.notif.error("Http failure response. API is not running.");
                  }
              }
            
          ),
          
      )
  }
  else
      return next.handle(req.clone());
  }
 
}