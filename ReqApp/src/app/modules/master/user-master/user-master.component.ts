import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatDialogConfig } from "@angular/material/dialog";
import { PageEvent } from "@angular/material/paginator";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { AuthenticationService } from "src/app/core/service";
import { DivisionMaster, User } from "src/app/shared/interface";
import { TableColumn } from "src/app/shared/interface/table-column";
import { NotificationService, UserService } from "src/app/shared/service";

@Component({
  selector: 'app-user-master',
  templateUrl: './user-master.component.html',
  styleUrls: ['./user-master.component.scss']
})
export class UserMasterComponent implements OnInit, AfterViewInit {

  limit: 10; 
  page = 1;
  users: User[];
  tableColumns: TableColumn[];
  user: User;
  total: number;
  pageEvent: PageEvent;
  length: number;
  searchKey: string;
  searchBranch: string;  
  errorMsg: string;
  responseMsg: any;
  status: string;

  constructor(private _userData: UserService,
              private auth: AuthenticationService, 
              private notif: NotificationService,
              private changeDetectorRef: ChangeDetectorRef,
              private route: ActivatedRoute) {
                this.auth.user.subscribe(x => this.user = x);
                
                this._userData.listen().subscribe((m:any)=>{ 
                  this.getDatas(this.page,this.limit);
                }); 
  }

  ngOnInit(): void {
    this.initializeColumns();
    this.searchBranch = this.user.branchCode;
    this.getDatas(this.page, this.limit); 
  }

  ngAfterViewInit(): void {
  } 
 
  initializeColumns(): void {
    this.tableColumns = [
      {
        name: 'Name',
        dataKey: 'fullName',
        position: 'left',
        isSortable: false
      },
      {
        name: 'Username',
        dataKey: 'userName',
        position: 'left',
        isSortable: false
      },
      {
        name: 'Branch',
        dataKey: 'branchCode',
        position: 'left',
        isSortable: false
      },
      {
        name: 'Position',
        dataKey: 'positionName',
        position: 'left',
        isSortable: false
      },
      {
        name: 'Store',
        dataKey: 'storeBased',
        position: 'left',
        isSortable: false
      }
    ];
  }

  getDatas(page:number, size:number) {
    const search = this.searchKey;
    const branchCode = this.searchBranch;

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.status = params.get('status');
      console.log(this.status);
      let http;
      
      if (this.status == 'inactive')
        http = this._userData.getInactiveUsers(page,size, search, branchCode);
      else 
        http = this._userData.getUsersByBranch(page,size, search, branchCode);

      http.subscribe({
        next: (res) => {
          this.total = res.page.total; 
          this.users = res.page.data;
        }
      }); 

  });
  } 

  filterData(data) {
    // console.log('searching');
    // console.log(data);
    this.searchKey = data.search;
    this.searchBranch = data.branchCode;
    this.getDatas(this.page,this.limit);
  }

  filterBranch(data) { 
    this.searchBranch = data;
    this.getDatas(this.page,this.limit);
  }

  clearSearch(data) {
    if (data) {
      this.searchKey = "";
      this.getDatas(this.page,this.limit);
    }
  } 

  assignBranch(data) {
    if (data) { 
        this.errorMsg = "";
  
        this._userData.assignUsersBranch(data)
          .subscribe({
            next: (data) => { 
              this.nextResponse(data);
            }, 
            error: (response) => { 
              this.errorResponse(response);
            }
          })
    }
  }

  changePass(data) {
    if (data) { 
        this.errorMsg = "";
  
        this._userData.changePassword(data)
          .subscribe({
            next: (data) => { 
              this.nextResponse(data);
            }, 
            error: (response) => { 
              this.errorResponse(response);
            }
          })
    }
  }
  updateUser(data) {
    if (data) { 
        this.errorMsg = ""; 
        if (data.action == 'verified_user')
          data.active = 1;
        else if (data.action == 'store')
          data.storeBased = 'N';
        else if (data.action == 'power_settings_new')
          data.active = 3;
        
        this._userData.updateUser(data)
          .subscribe({
            next: (data) => { 
              this.nextResponse(data);
            }, 
            error: (response) => { 
              this.errorResponse(response);
            }
          });
    }
  }
 
  nextResponse(data) {
    if (data.responseCode == 1) {
        this.responseMsg = data.responseMessage;
        this.notif.success(this.responseMsg); 
        this.getDatas(this.page,this.limit);
    }
    else {
      this.errorMsg = data.dataSet !== null? data.dataSet.join("; "): data.responseMessage;
      this.notif.error(this.errorMsg);
    }
  }

  errorResponse(response) {
    this.errorMsg = response.name + '\n' + response.message;
    // console.log(this.errorMsg);
    this.notif.error(this.errorMsg);
  }
  
  onPaginateChange(event: PageEvent) {
    console.log(event);
    let page = event.pageIndex;
    let size = event.pageSize;
  
    page = page +1;
    this.getDatas(page, size);
  } 
}
