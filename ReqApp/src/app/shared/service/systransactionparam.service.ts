import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core'; 
import { environment } from 'src/environments/environment'; 

@Injectable({
  providedIn: 'root'
})
export class SystransactionparamService {

  constructor(private httpClient: HttpClient) { }

  public getDisplayCode(reqType: string, branchCode: string) {
    return this.httpClient.get(environment.baseApiUrl+'SysTransactionParam/GetDisplayCode/'+reqType+'/'+branchCode,{responseType: 'text'});
  }
}
