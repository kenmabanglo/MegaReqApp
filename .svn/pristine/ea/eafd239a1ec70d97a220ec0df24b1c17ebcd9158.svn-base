import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PaginatedResponse } from '../interface';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  constructor(private httpClient: HttpClient) { }

  public getSuppliers(
    pageIndex:number=1, pageSize:number=10,
    filter: string=''): Observable<any> {
    return this.httpClient.get<any>(environment.baseApiUrl+'suppliermaster/list',{
      params: new HttpParams()
      .set('pageIndex',pageIndex)
      .set('pageSize',pageSize)
      .set('filter',filter)
    });
  }

   findAll(pageIndex:number=1, pageSize:number=10,search: string="",limit:number=100): Observable<PaginatedResponse> {
    let params = new HttpParams();

    params = params.append('pageIndex',pageIndex);
    params = params.append('pageSize',pageSize);
    params = params.append('search',search); 
    params = params.append('limit',limit); 
    
    return this.httpClient.get<any>(environment.baseApiUrl+'suppliermaster/list',{params})
    .pipe(
      map((data: PaginatedResponse)=> data),
      catchError(err => throwError(err))
    )
   }
}
