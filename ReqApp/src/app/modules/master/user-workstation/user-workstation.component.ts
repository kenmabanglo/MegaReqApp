import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { AuthenticationService } from 'src/app/core/service';
import { User } from 'src/app/shared/interface';
import { TableColumn } from 'src/app/shared/interface/table-column';
import { UserService } from 'src/app/shared/service';

@Component({
  selector: 'app-user-workstation',
  templateUrl: './user-workstation.component.html',
  styleUrls: ['./user-workstation.component.scss']
})
export class UserWorkstationComponent implements OnInit {
  limit: 10; 
  page = 1;
  users: User[];
  tableColumns: TableColumn[];
  user: User;
  total: number;
  pageEvent: PageEvent;
  length: number;
  searchKey: string;

  constructor(private _userData: UserService,
              private auth: AuthenticationService,
              private changeDetectorRef: ChangeDetectorRef) {
                this.auth.user.subscribe(x => this.user = x);
                
                this._userData.listen().subscribe((m:any)=>{ 
                  this.getDatas(this.page,this.limit);
                }); 
  }

  ngOnInit(): void {
    this.initializeColumns();
    this.getDatas(this.page, this.limit); 
  }

  ngAfterViewInit(): void {
    
  }

 
  initializeColumns(): void {
    this.tableColumns = [
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
      }
    ];
  }

  getDatas(page:number, size:number) {
    const search = this.searchKey;
    this._userData.getUsersByBranch(page,size, search, this.user.branchCode)
    .subscribe({
      next: (res) => {
        this.total = res.page.total; 
        this.users = res.page.data;
      }
    });

  }
  filterData(data) {
    // console.log('searching');
    // console.log(data);
    this.searchKey = data;
    this.getDatas(this.page,this.limit);
  }

  clearSearch(data) {
    if (data) {
      this.searchKey = "";
      this.getDatas(this.page,this.limit);
    }
  }

  onPaginateChange(event: PageEvent) {
    let page = event.pageIndex;
    let size = event.pageSize;
  
    page = page +1;
    this.getDatas(page, size);
  } 

}
