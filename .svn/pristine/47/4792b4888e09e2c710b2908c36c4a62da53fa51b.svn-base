import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table'; 
import { AuthenticationService } from 'src/app/core/service';
import { PaginatedResponse } from 'src/app/shared/interface';
import { RequestService } from 'src/app/shared/service'; 

@Component({
  selector: 'app-approval-history',
  templateUrl: './approval-history.component.html'
})
export class ApprovalHistoryComponent implements OnInit { 

  dataSource: MatTableDataSource<PaginatedResponse> = null;
  columns = ['reqNo','requestor','reqType','approvedDate','status', 'actions']; 
  dataset: any;  
  public requestTypes:any;
  constructor(
    private _requestData: RequestService, private authService: AuthenticationService
  ) { 
    
  }

  ngOnInit() { 
    //this.initDataSource();
  }
  
  initDataSource(data:any={}) {
    
    this._requestData.getApprovedHistory('Approver', data.page || 1, data.limit || 10, data.search || '', data.req,"","","approved")
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
            
            if (r == this.authService.userValue.userName) {
              result.page.data[key].approvedDate = d8;
              break;
            }
          }
        }); 
        this.dataset = result;
    });

  };


}
