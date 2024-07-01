import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { catchError, filter, map } from 'rxjs/operators';
import { Observable, Subject, throwError } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt'; 
import { Constants } from 'src/app/core/constants/constants';
import { ResponseModel } from 'src/app/shared/models/response';
import { User } from '../interface/user.interface';
import { PaginatedResponse } from '../interface';
import { AuthenticationService } from 'src/app/core/service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  invalidLogin!: boolean;
  invalidRegister!: boolean;
  tokenResp:any;
  user: User;

  constructor(private httpClient: HttpClient, 
    private router: Router,
    private jwtHelper: JwtHelperService,
    private auth: AuthenticationService
    ) { 
      this.auth.user.subscribe(x => this.user = x); 
    }

  public login(body: any): Observable<ResponseModel>
  {
    return this.httpClient.post<ResponseModel>(environment.baseApiUrl+"User/Login", body);
  }

  public register(body: any, role: string): Observable<ResponseModel>
  {
    return this.httpClient.post<ResponseModel>(environment.baseApiUrl+"User/RegisterUser/"+role, body);
  }

  public getUserById(Id: string): Observable<User> {
    return this.httpClient.get<User>(environment.baseApiUrl+'User/GetUser/'+Id);
  }

  public getAll(): Observable<PaginatedResponse> {
      let params = new HttpParams();

    return this.httpClient.get<any>(environment.baseApiUrl+'User/GetAllUser',{params})
    .pipe(
      map((data: PaginatedResponse)=> data),
      catchError(err => throwError(err))
    )
  }

  getUsersByBranch(pageIndex:number=1, pageSize:number = 10,search="", branchCode="", userName=""): Observable<PaginatedResponse> {
    let params = new HttpParams();

    params = params.append('pageIndex',pageIndex);
    params = params.append('pageSize',pageSize);
    params = params.append('search',search);
    params = params.append('branchCode',branchCode);   
    params = params.append('userName',userName);  
    
    return this.httpClient.get<any>(environment.baseApiUrl+'User/GetAllUsersByBranch',{params})
    .pipe(
      map((data: PaginatedResponse)=> data),
      catchError(err => throwError(err))
    );
   }

   getUserRights(userName) {
    return this.httpClient.get<any>(environment.baseApiUrl+'User/GetUserRights?userName='+userName)
    .pipe(
      map(
        (data) => { return data.filter(x=>x.startsWith('VA')) }
      ),
      catchError(err => throwError(err))
    )
   }

   getInactiveUsers(pageIndex:number=1, pageSize:number = 10,search="", branchCode="", userName=""): Observable<PaginatedResponse> {
    let params = new HttpParams();

    params = params.append('pageIndex',pageIndex);
    params = params.append('pageSize',pageSize);
    params = params.append('search',search);  
    params = params.append('userName',userName);  
    params = params.append('branchCode',branchCode);  
    
    return this.httpClient.get<any>(environment.baseApiUrl+'User/GetAllInactiveUsers',{params})
    .pipe(
      map((data: PaginatedResponse)=> data),
      catchError(err => throwError(err))
    );
   }


   getApprovers(body:any): Observable<PaginatedResponse> {
   
    let params = new HttpParams();

    params = params.append('pageIndex',body['pageIndex']);
    params = params.append('pageSize',body['pageSize']);
    params = params.append('search',body['search']);
    params = params.append('branchCode',body['branchCode']);   
    params = params.append('userName',body['userName']);  
    params = params.append('positionName',body['positionName']);  
    params = params.append('approverNum',body['approverNum']);  
    params = params.append('reqType',body['reqType']);  
    params = params.append('estimatedAmt',body['estimatedAmt']);  
    
    return this.httpClient.get<any>(environment.baseApiUrl+'User/GetAllApproversNew',{params})
    .pipe(
      map((data: PaginatedResponse)=> data),
      catchError(err => throwError(err))
    );
   }
 
   getUsers(body:any): Observable<PaginatedResponse> {
   
    let params = new HttpParams();

    params = params.append('pageIndex',body['pageIndex']);
    params = params.append('pageSize',body['pageSize']);
    params = params.append('search',body['search']);
    params = params.append('branchCode',body['branchCode']);   
    params = params.append('userName',body['userName']);  
    params = params.append('positionName',body['positionName']);  
    params = params.append('approverNum',body['approverNum']);  
    params = params.append('reqType',body['reqType']);  
    params = params.append('estimatedAmt',body['estimatedAmt']);  
    
    return this.httpClient.get<any>(environment.baseApiUrl+'User/GetAllApproversNew',{params})
    .pipe(
      map((data: PaginatedResponse)=> data),
      catchError(err => throwError(err))
    );
   }

   getAllApprovers(body:any): Observable<PaginatedResponse> {
   
    let params = new HttpParams();

    params = params.append('pageIndex',body['pageIndex']);
    params = params.append('pageSize',body['pageSize']);
    params = params.append('search',body['search']);
    params = params.append('userName',body['userName']);  
    
    return this.httpClient.get<any>(environment.baseApiUrl+'User/GetAllApproversNoBranch',{params})
    .pipe(
      map((data: PaginatedResponse)=> data),
      catchError(err => throwError(err))
    );
   }

   changePassword(data:any) {
      return this.httpClient.post<any>(environment.baseApiUrl+'User/ChangePassword',data)
      .pipe(
        map((result)=> {
          return result;
        })
      );
    }
    
   assignUsersBranch(body: any): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(environment.baseApiUrl+'User/AssignUserBranch',body)
   }
   
   updateUser(body: any): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(environment.baseApiUrl+'User/UpdateUserSettings',body)
   } 

   assignUserApprover(body: any): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(environment.baseApiUrl+'User/AssignUserApprover',body)
   }

  // Ken - Get Current User Approver based on userName - 6/21/2024
  getCurrentUserApprover(userName: string): Observable<any> {
    return this.httpClient.get<any>(environment.baseApiUrl+'User/GetCurrentUserApprover?userName='+userName);
  }
  
  // Ken - Delete User Approver based on tranId - 6/21/2024
  deleteUserApprover(tranId: string): Observable<any> {
    return this.httpClient.delete<any>(environment.baseApiUrl+'User/DeleteUserApprover?tranId='+tranId);
  }

  //deleteUserApprover(tranId: string, options: any): Observable<any> {
  //  const url = `User/DeleteUserApprover?tranId=${tranId}`;
  //  return this.httpClient.delete<any>(environment.baseApiUrl+url, options);
  //}

  // Ken - Get Current Branches Assigned to userName - 6/25/2024

  //getAllBranches(body:any): Observable<PaginatedResponse> {
   
  //  let params = new HttpParams();

  //  params = params.append('pageIndex',body['pageIndex']);
  //  params = params.append('pageSize',body['pageSize']);
  //  params = params.append('search',body['search']);
    
  //  return this.httpClient.get<any>(environment.baseApiUrl+'User/GetAllBranches',{params})
  //  .pipe(
  //    map((data: PaginatedResponse)=> data),
  //    catchError(err => throwError(err))
  //  );
  //}

  getAllBranches(params: { pageIndex: number, pageSize: number, search: string, branchCode: string }): Observable<PaginatedResponse> {
    const { pageIndex, pageSize, search, branchCode } = params;
    const url = `User/GetAllBranches?pageIndex=${pageIndex}&pageSize=${pageSize}&search=${search}&branchCode=${branchCode}`;
    return this.httpClient.get<PaginatedResponse>(environment.baseApiUrl+url);
  }

  getCurrentUserBranches(userName: string): Observable<any> {
    return this.httpClient.get<any>(environment.baseApiUrl +'User/GetCurrentUserBranch?userName='+userName);
  }

  addUserBranch(body: any): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(environment.baseApiUrl+'User/AddUserBranch', body)
  }

  deleteUserBranch(userName: string, branchCode: string, divisionName: string): Observable<any> {
    return this.httpClient.delete<any>(environment.baseApiUrl + 'User/DeleteUserBranch?userName=' + userName + '&branchCode=' + branchCode + '&divisionName=' +divisionName);
  }

  //

  public jwt_auth() {
    let token=JSON.parse(localStorage.getItem(Constants.JWT_KEY)!);
    const headers = new HttpHeaders ({
      'Authorization':`Bearer ${token}`
    });
    return headers;
  }

  public updateData(body: any): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(environment.baseApiUrl+"User/UpdateUser", body);
  }

  public insertUpdateData(code: string, body: User): Observable<ResponseModel> {
    if (!code) {
      return this.httpClient.post<ResponseModel>(environment.baseApiUrl+"User/RegisterUser", body);
    }
    return this.httpClient.put<ResponseModel>(environment.baseApiUrl+"User/UpdateUser/"+code, body);
  }

  public updateProfile(formData: FormData) {
    return this.httpClient.post(environment.baseApiUrl+"User/UpdateProfile", formData, {reportProgress: true, observe: 'events' });
  }

  public deleteData(id: number): Observable<ResponseModel> {
    return this.httpClient.delete<ResponseModel>(environment.baseApiUrl+"User/DeleteUser/" + id)
  }

  public getLoggedUserInfo() {
    var token = localStorage.getItem(Constants.JWT_KEY);
    let userInfo=JSON.parse( window.atob(token.split('.')[1]));
    return userInfo;
  } 
  getLoggedBranchCode() {
    var token = localStorage.getItem(Constants.JWT_KEY);
    let userInfo=JSON.parse( window.atob(token.split('.')[1]));
    return userInfo?.branchCode;
  }

  GetBranchbyToken(token:any) {
    var branch = '';
    if (token) {
      this.tokenResp = JSON.parse(window.atob(token.split('.')[1]));
      branch = this.tokenResp.branchCode;
    } 

    return branch;
  }

  getUserRole() {
    var userRole = '';
    var token = localStorage.getItem(Constants.JWT_KEY);
    if (token != null)  {
      var payLoad = JSON.parse(window.atob(token.split('.')[1]));
      userRole = payLoad.role;
    }  
    return userRole;
  }

  GetToken() {
    return localStorage.getItem(Constants.JWT_KEY);
  }

  public isDM() { 
    var ret = false;
    if(this.user.positionName.search(/District Manager/i) >= 0) {
      ret = true;
    }
    return ret;
  }

  GetRolebyToken(token:any) {
    var role = '';
    if (token) {
      this.tokenResp = JSON.parse(window.atob(token.split('.')[1]));
      role = this.tokenResp.role;
    } 
    
    return role;
  }

  roleMatch(allowedRoles: any): boolean {
    var isMatch = false;
    var userRole = this.GetRolebyToken(this.GetToken());
  
    allowedRoles.forEach((element: any) => {
    
      if (userRole == element) {
        isMatch = true;
        return;
      }
    });

    return isMatch;
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
