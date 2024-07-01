import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { PaginatedResponse } from '../interface';
import { catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TalentMasterService {

  constructor(private httpClient: HttpClient) {}

  public getReason(): Observable<any> {
    return this.httpClient.get<any>(environment.baseApiUrl+'talentrequestmaster/GetReason');
  }

  public getEmpStatus(): Observable<any> {
    return this.httpClient.get<any>(environment.baseApiUrl+'talentrequestmaster/EmpStatus');
  }

  public getAllowances(): Observable<any> {
    return this.httpClient.get<any>(environment.baseApiUrl+'talentrequestmaster/Allowances');
  }

  public getBenefits(): Observable<any> {
    return this.httpClient.get<any>(environment.baseApiUrl+'talentrequestmaster/Benefits');
  }
  
}
