import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PaginatedResponse } from 'src/app/shared/interface/paginated-response'; 
import { RequestService } from 'src/app/shared/service/request.service';
 
@Component({
  selector: 'app-approval-monitoring',
  templateUrl: './approval-monitoring.component.html'
})
export class ApprovalMonitoringComponent implements OnInit {
  columns = ['branchCode','reqType','reqNo','date','requestor','dateRequired','status', 'actions'];
  dataset: any;
  public requestTypes:any;
  
  constructor( 
    private _requestData: RequestService
  ) {  
  }

  ngOnInit():void {  
    // this.initDataSource();
  } 

  initDataSource(data:any={}) {
    
    this._requestData.getRequestsForApproval(data.page || 1, data.limit || 10, data.search || '')
    .subscribe(
      (result: any) => {
        this.dataset = result;
        console.log(this.dataset);
      }
    );
    
  }
}
