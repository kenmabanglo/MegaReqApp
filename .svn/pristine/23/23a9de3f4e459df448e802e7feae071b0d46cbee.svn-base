import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table'; 
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/core/service';
import { PaginatedResponse, User } from 'src/app/shared/interface';
import { RequestService, UserService } from 'src/app/shared/service'; 
import { viewers_access } from 'src/app/core/guard/viewer_list';

@Component({
  selector: 'app-approval-closed',
  templateUrl: './approval-closed.component.html'
})
export class ApprovalClosedComponent implements OnInit { 

  dataSource: MatTableDataSource<PaginatedResponse> = null;
  columns = ['branchCode','reqNo','requestor','reqType','approvedDate', 'actions']; 
  dataset: any;  

  user: any; //User
  access:any;
  requestTypes: [] = [];

 
 
  constructor(
    private _requestData: RequestService, 
    private auth: AuthenticationService, 
    private route: ActivatedRoute,
    private userService: UserService
  ) { 
    this.auth.user.subscribe(x => this.user = x); 
  }

  ngOnInit() { 
    this.initDataSource();
  }
  
  
  initDataSource(data:any={}) {
    
    this._requestData.getApprovedList('Viewer', data.page || 1, data.limit || 10, data.search || '', data.req || data.requestTypes || '', data.closed = "Y",data.branchCode || '')
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
            
            if (r == this.user.userName) {
              result.page.data[key].approvedDate = d8;
              break;
            }
          }
        }); 
        this.dataset = result;
    });

  };



}
