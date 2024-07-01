import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AuthenticationService } from 'src/app/core/service';
import { PaginatedResponse } from 'src/app/shared/interface';
import { RequestService } from 'src/app/shared/service';

@Component({
  selector: 'app-rejected-history',
  templateUrl: './rejected-history.component.html',
  styleUrls: ['./rejected-history.component.scss']
})
export class RejectedHistoryComponent implements OnInit {

  dataSource: MatTableDataSource<PaginatedResponse> = null;
  columns = ['reqNo','requestor','reqType','rejectedDate', 'actions']; 
  dataset: any;  
  public requestTypes:any;
 
  constructor(
    private _requestData: RequestService, private authService: AuthenticationService
  ) { 
    
  }

  ngOnInit() { 
    this.initDataSource();
  }
  
  initDataSource(data:any={}) {
    
    this._requestData.getApprovedHistory('Approver', data.page || 1, data.limit || 10, data.search || '', data.req,"","","rejected")
    .subscribe(
      (result: PaginatedResponse) => {
        
        const data =  result.page.data

        Object.keys(data).forEach((val,key)=> {
          let approver = 0; let approved = 0; let rejects = 0;
          for (let i = 1; i <= 5; i++) {
            const d = data[key]; 
            const r = d['approver'+i];
            const d8 = d['approvedDate'+i]; 
            let c; let s;
            console.log(r,this.authService.userValue.userName);
            if (r == this.authService.userValue.userName) {
              result.page.data[key].rejectedDate = d8;

              break;
            }
          }
        }); 
        this.dataset = result;
        console.log(this.dataset);
    });

  };


}
