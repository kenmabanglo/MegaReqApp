import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(public snackbar: MatSnackBar,
    private http: HttpClient,
    ) { }

  config: MatSnackBarConfig = {
    duration: 3000,
    horizontalPosition: 'right',
    verticalPosition: 'top'
  }

  success(msg: string) {
    this.config['panelClass'] = ['notification','success'];
    this.snackbar.open(msg,'', this.config);
  }
  error(msg: string) {
    this.config['panelClass'] = ['notification','error'];
    this.snackbar.open(msg,'', this.config);
  }

  getTotalPendingRequests(userName: string) {
    let params = new HttpParams();
    params = params.append('userName', userName);  
    return this.http.get<number>(environment.baseApiUrl+'RequestMaster/CountPendingRequests',{params})
  }

  getTotalInactiveUsers(userName: string) {
    if (userName != 'admin') return 0;
    let params = new HttpParams(); 
    return this.http.get<number>(environment.baseApiUrl+'User/CountInactiveUsers')
  }


}

