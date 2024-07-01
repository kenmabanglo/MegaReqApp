import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { viewers, viewers_access } from 'src/app/core/guard/viewer_list';
import { AuthenticationService } from 'src/app/core/service';
import { AuthTab } from 'src/app/layout/auth-layout/auth-layout.component';
import { PaginatedResponse, User } from 'src/app/shared/interface';
import { RequestService, UserService } from 'src/app/shared/service';
 

@Component({
  selector: 'app-approved',
  templateUrl: './approved.component.html',
  styleUrls: ['./approved.component.scss']
})
export class ApprovedComponent implements OnInit {
  requestType: string='';
  public requestTypes:any;
  user: any;
  access:any;
  
  dataSource: MatTableDataSource<PaginatedResponse> = null;
  columns = []; 
  dataset: any;  
  tabs: AuthTab[] = [];
 
  
  constructor(
    private _requestData: RequestService,
    private auth: AuthenticationService, 
    private userService: UserService,
    private route: ActivatedRoute) {
    this.auth.user.subscribe(x => this.user = x); 
 
    
    if (this.user.userName == "Cyrine01")
    {
      this.columns = ['branchCode','reqType','reqNo','requestor','date', 'actions'];
    }
    else {
      this.columns = ['branchCode','reqType','reqNo','requestor','approvedDate', 'type','actions'];
    }
   }

  ngOnInit(): void {

   
    
     //this.initDataSource();
  }
 
  initDataSource(data:any={}) {
    
    this._requestData.getApprovedList('Viewer', data.page, data.limit, data.search || '', data.req || data.requestTypes || '',"",data.branchCode || '')
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
