import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { PaginatedResponse } from '../interface';
import { catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViewMasterService {

  constructor(private httpClient: HttpClient) {}

  public divisionMaster(): Observable<any> {
    return this.httpClient.get<any>(environment.baseApiUrl+'divisionmaster/list');
  }

  findAll(type:string="",pageIndex:number=1, pageSize:number=10,search: string="",limit=100, supplier = ""): Observable<PaginatedResponse> {
    let params = new HttpParams();

    params = params.append('pageIndex',pageIndex);
    params = params.append('pageSize',pageSize);
    params = params.append('search',search); 
    params = params.append('limit',limit); 
    params = params.append('supplierCode',supplier); 
    
    return this.httpClient.get<any>(environment.baseApiUrl+type+'/list',{params})
    .pipe(
      map((data: PaginatedResponse)=> data),
      catchError(err => throwError(err))
    )
   }
   
  public getDepartments(): Observable<any> {
    return this.httpClient.get<any>(environment.baseApiUrl+'departmentmaster/list');
  }
  
}
