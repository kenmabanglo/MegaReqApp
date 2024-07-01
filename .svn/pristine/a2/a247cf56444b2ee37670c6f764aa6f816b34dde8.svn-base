import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { AuthenticationService } from 'src/app/core/service';
import { PaginatedResponse } from 'src/app/shared/interface';
import { RequestService } from 'src/app/shared/service';
// import { ModalWrapperComponent } from 'src/app/shared/component';

@Component({
  selector: 'app-request-history',
  templateUrl: './request-history.component.html'
})
export class RequestHistoryComponent implements OnInit {
   
  columns =  ['branchCode','reqNo','reqType','date','approvedDate','status', 'actions'];
  dataset: any;   
   
  constructor(
    private _requestData: RequestService, private authService: AuthenticationService
  ) { 
     
  }

  ngOnInit() { 
    // this.initDataSource();
  }
   
initDataSource(data:any={}) {  
  this._requestData.getApprovedHistory('Requestor', data.page || 1, data.limit || 10, data.search || '', data.req,"","","").pipe(
    map((res: PaginatedResponse) =>{ 
      // console.log(res);
      const datas = res;
      const data = res.page.data;

      Object.keys(data).forEach((val,key)=> {
        let approver = 0; let approved = 0; let rejects = 0;
        for (let i = 1; i <= 5; i++) {
          const d = data[key]; 
          const r = d['approver'+i];
          const a = d['approved'+i]; 
          let c; let s;
          
          if (r != null) {
            approver+=1; 
            if (a == 'Y') { approved +=1;}
            if (a == 'N') { rejects+=1 }
          }
        }

        // console.log(approver, approved, rejects);
        if (approver == approved) {
          data[key].col = 'label-green';
          data[key].status = 'Approved';
        }
        if (approver != approved && rejects == 0) {
          data[key].col = 'label-blue';
          data[key].status = 'Pending';
        }
        if (approver != approved && rejects > 0) {
          data[key].col = 'label-red';
          data[key].status = 'Rejected';
        }
      });
      datas.page.data = data;
      this.dataset = datas; 
    })
  ).subscribe();
} 
 
}
