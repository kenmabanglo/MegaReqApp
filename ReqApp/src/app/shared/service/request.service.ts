import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, delay, map, Observable, of, Subject, throwError } from 'rxjs';
import { AuthenticationService } from 'src/app/core/service/authentication.service';
import { environment } from 'src/environments/environment';
import { PaginatedResponse, RequestMaster, User } from '../interface';
import { ResponseModel } from '../models/response';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  public totalRequest: Observable<number>;

  user: any;
  constructor(
    private httpClient: HttpClient, 
    private authService: AuthenticationService) { 
      this.authService.user.subscribe(x=>this.user = x);
      
    }

  // from api
  public requestTypeMaster(): Observable<any> {
    return this.httpClient.get<any>(environment.baseApiUrl+'RequestTypeMaster/List');
  }

  public saveRequest(body): Observable<ResponseModel>
  {
    return this.httpClient.post<ResponseModel>(environment.baseApiUrl+"RequestMaster/SendRequest", body);
  }
  public updateRequest(body): Observable<ResponseModel>
  {
    return this.httpClient.post<ResponseModel>(environment.baseApiUrl+"RequestMaster/UpdateRequest", body);
  }

  public uploadFiles(formData)
  { 
    return this.httpClient.post(environment.baseApiUrl+"RequestMaster/UploadFiles", formData);
  }

  getRequestsForApproval(pageIndex:number=1, pageSize:number=10,search: string=""): Observable<PaginatedResponse> {
    let params = new HttpParams();

    params = params.append('pageIndex',pageIndex);
    params = params.append('pageSize',pageSize);
    params = params.append('search',search);
    params = params.append('user',this.user.userName);
    params = params.append('branchCode',this.user.branchCode);
    
    return this.httpClient.get<PaginatedResponse>(environment.baseApiUrl+'RequestMaster/GetRequestsForApproval',{params})
    .pipe(
      map((data: PaginatedResponse)=> data),
      catchError(err => throwError(err))
    )
   }
   

   getRequestDetails(requestNo: string, branchCode: string, requestTypeCode: string) {
      let params = new HttpParams();

      params = params.append('requestNo', requestNo); 
      params = params.append('branchCode',branchCode);
      params = params.append('requestTypeCode', requestTypeCode);

      return this.httpClient.get<RequestMaster>(environment.baseApiUrl+'RequestMaster/GetRequestDetails',{params});
   }

   public getAttachments(data){
    let params = new HttpParams();

    params = params.append('requestNo', data.requestNo); 
    params = params.append('branchCode',data.branchCode);
    params = params.append('requestTypeCode', data.requestTypeCode);
    params = params.append('row', data.row);

    return this.httpClient.get(environment.baseApiUrl+"RequestMaster/GetAttachments",{params});
  }

   getRequestFiles(requestNo: string, branchCode: string, requestTypeCode: string) {
    let params = new HttpParams();

    params = params.append('requestNo', requestNo); 
    params = params.append('branchCode',branchCode);
    params = params.append('requestTypeCode', requestTypeCode);

    return this.httpClient.get<any>(environment.baseApiUrl+'RequestMaster/GetRequestFiles',{params})
 }

 downloadFile(requestNo: string, branchCode: string, requestTypeCode: string, row: number) {		
  let params = new HttpParams();

    params = params.append('requestNo', requestNo); 
    params = params.append('branchCode',branchCode);
    params = params.append('requestTypeCode', requestTypeCode);
    params = params.append('row', row);

  return this.httpClient.get(environment.baseApiUrl+'RequestMaster/DownloadFile', { params, responseType: 'blob', observe: 'response' });
 }

   approveRequest(body: any): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(environment.baseApiUrl+'RequestMaster/ApproveRequest',body)
   }

   closedRequest(body: any): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(environment.baseApiUrl+'RequestMaster/ClosedRequest',body)
   }
   
   getApprovedHistory(type:string, pageIndex:number=1, pageSize:number=10,search: string="", reqType: string="", closed: string = "", branchCode:string = "", status=""): Observable<PaginatedResponse> {
    let params = new HttpParams();

    params = params.append('type',type);
    params = params.append('pageIndex',pageIndex);
    params = params.append('pageSize',pageSize);
    params = params.append('closed',closed);
 
    if (search != "") {
      params = params.append('search',search);
    }

      params = params.append('user',this.user.userName);
      params = params.append('branchCode', branchCode);
    
    if(reqType != "")
      params = params.append('requestTypeCode',reqType);
    
    let method;
      if (status == 'approved') {
        method = 'GetApprovedHistory';
      }
      else if (status == 'rejected') {
        method = 'GetRejectedHistory';
      }
      else {
        method = 'GetApprovedHistory';
      }

    return this.httpClient.get<PaginatedResponse>(environment.baseApiUrl+'RequestMaster/'+method,{params})
    .pipe(
      map((data: PaginatedResponse)=> data),
      catchError(err => throwError(err))
    )
   }

   getApprovedList(type:string, pageIndex:number=1, pageSize:number=10,search: string="", reqType: string="", closed: string = "", branchCode:string = ""): Observable<PaginatedResponse> {
    let params = new HttpParams();

    params = params.append('type',type);
    params = params.append('pageIndex',pageIndex);
    params = params.append('pageSize',pageSize);
    params = params.append('closed',closed);
    params = params.append('user',this.user.userName);
    params = params.append('branchCode', branchCode);
 
    if (search != "") params = params.append('search',search);
    if(reqType != "") params = params.append('requestTypeCode',reqType);

    let func = 'ViewApprovedList';
    //if (this.user.userName == 'Cyrine01') func = 'ViewADBDMApproves';
      
    return this.httpClient.get<PaginatedResponse>(environment.baseApiUrl+'RequestMaster/'+func,{params})
    .pipe(
      map((data: PaginatedResponse)=> data),
      catchError(err => throwError(err))
    )
   }

  //  getADBDMList(type:string, pageIndex:number=1, pageSize:number=10,search: string="", reqType: string="", closed: string = "", branchCode:string = ""): Observable<PaginatedResponse> {
  //   let params = new HttpParams();

  //   params = params.append('type',type);
  //   params = params.append('pageIndex',pageIndex);
  //   params = params.append('pageSize',pageSize);
  //   params = params.append('closed',closed);
 
  //   if (search != "") {
  //     params = params.append('search',search);
  //   }

  //     params = params.append('user',this.user.userName);
  //     params = params.append('branchCode', branchCode);
    
  //   if(reqType != "")
  //     params = params.append('requestTypeCode',reqType);
    
  //   return this.httpClient.get<PaginatedResponse>(environment.baseApiUrl+'RequestMaster/ViewADBDMApproves',{params})
  //   .pipe(
  //     map((data: PaginatedResponse)=> data),
  //     catchError(err => throwError(err))
  //   )
  //  }

   findAllADBNo(pageIndex:number=1, pageSize:number=10,branchCode="",search: string="",limit:number=100): Observable<PaginatedResponse> {
    let params = new HttpParams();

    params = params.append('pageIndex',pageIndex);
    params = params.append('pageSize',pageSize);
    params = params.append('search',search); 
    params = params.append('branchCode',branchCode); 
    params = params.append('limit',limit); 
    
    return this.httpClient.get<any>(environment.baseApiUrl+'RequestMaster/ReferenceADB',{params})
    .pipe(
      map((data: PaginatedResponse)=> data),
      catchError(err => throwError(err))
    )
   }

   
   findAllRFPNo(pageIndex:number=1, pageSize:number=10,branchCode="",search: string="",limit:number=100): Observable<PaginatedResponse> {
    let params = new HttpParams();

    params = params.append('pageIndex',pageIndex);
    params = params.append('pageSize',pageSize);
    params = params.append('search',search); 
    params = params.append('branchCode',branchCode); 
    params = params.append('limit',limit); 
    
    return this.httpClient.get<any>(environment.baseApiUrl+'RequestMaster/ReferenceRFP',{params})
    .pipe(
      map((data: PaginatedResponse)=> data),
      catchError(err => throwError(err))
    )
   }

   isFinalApprover(userName, estimatedAmt, approverNum): Observable<PaginatedResponse> {
    let params = new HttpParams();

    params = params.append('userName',userName);
    params = params.append('estimatedAmt',estimatedAmt);
    params = params.append('approverNum',approverNum);
    
    return this.httpClient.get<any>(environment.baseApiUrl+'User/IsFinalApprover',{params})
   }

   verifySerialNoAvailability(datas): Observable<ResponseModel> {
    let params = new HttpParams();
 
    params = params.append('itemCode',datas['itemCode']);
    params = params.append('serialNo',datas['serialNo']);
    params = params.append('locationCode',datas['locationCode']);
    params = params.append('supplierCode',datas['supplierCode']);
    
    return this.httpClient.get<ResponseModel>(environment.baseApiUrl+'RequestMaster/VerifySerialNoAvailability',{params})
    .pipe(
      map((data: ResponseModel)=> data),
      catchError(err => throwError(err))
    )
   }

   getLocations(): Observable<ResponseModel> { 
    
      return this.httpClient.get<ResponseModel>(environment.baseApiUrl+'RequestMaster/GetAllLocations')
      .pipe(
        map((data: ResponseModel)=> data),
        catchError(err => throwError(err))
      )
   }

   // refresh table after modal close
  private _listeners = new Subject<any>();
  listen(): Observable<any> {
    return this._listeners.asObservable();
  }

  filter(filterBy: string) {
    this._listeners.next(filterBy);
  }
  //. end refresh table after modal close
}
