import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
  })
  export class DashboardService {

    constructor(private httpClient: HttpClient) {

    }

  public getTotals(): Observable<any> {
      return this.httpClient.get<any>(environment.baseApiUrl+'Dashboard/GetTotals');
  }
  
  public topBuyers(): Observable<any> {
    return this.httpClient.get<any>(environment.baseApiUrl+'Dashboard/TopBuyers');
  }

  public topFarms(): Observable<any> {
    return this.httpClient.get<any>(environment.baseApiUrl+'Dashboard/TopFarms');
  }


  }