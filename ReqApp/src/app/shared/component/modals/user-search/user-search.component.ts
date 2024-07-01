import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { debounceTime, distinctUntilChanged, fromEvent, map, tap } from 'rxjs';
import { AuthenticationService } from 'src/app/core/service';
import { PaginatedResponse, User } from 'src/app/shared/interface';
import { UserService } from 'src/app/shared/service';
import { ApproversComponent } from '../approvers/approvers.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.scss']
})
export class UserSearchComponent implements OnInit {
  
  dataSource: MatTableDataSource<PaginatedResponse> = null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('search') input: ElementRef;
  
  isLoading: boolean;
  totalPage: number;
  users: User[]; 
  user: User;
  page = 1;
  limit = 10;
  hiddenClose: boolean = true;
  filterValue: string = null;
  pageEvent: PageEvent;
  displayedColumns: string[] = ['select','fullName','branchCode','positionName'];
  selected = {};
  selection = new SelectionModel<PaginatedResponse>(false, []);
  
  constructor(
    private _userData: UserService,
    private http: HttpClient,
    private router: Router, 
    private activatedRoute: ActivatedRoute,
    public dialogRef: MatDialogRef<ApproversComponent>, 
    @Inject(MAT_DIALOG_DATA) public passedData: any,
    private auth: AuthenticationService    
    ) {
        this.auth.user.subscribe(x => this.user = x); 
    }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource();
    this.initDataSource();
  }
  initDataSource(page:number=0, size: number=10, search: string="") {
    this.isLoading = true;
    
    this._userData.getUsersByBranch(
      page, size, search, '', ''
    )
    .pipe( 
      map((res: PaginatedResponse) =>{
        this.isLoading = false;
        this.totalPage = res.page.total;
        this.dataSource = res.page.data;
      })
    ).subscribe();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;

    // server-side search
    fromEvent(this.input.nativeElement,'keyup')
        .pipe(
            debounceTime(150),
            distinctUntilChanged(),
            tap(() => {
              this.hiddenClose = false;  
              this.initDataSource(0,10, this.input.nativeElement.value);
            })
        )
        .subscribe();
      
}
onPaginateChange(event: PageEvent) {
  let page = event.pageIndex;
  let size = event.pageSize;

  page = page +1;

  this.initDataSource(page, size);
} 
  clearSearch() {
    const input = this.input.nativeElement.value;
    if (input != "") {
      this.input.nativeElement.value = "";
      this.hiddenClose = true;
      //this.initDataSource();
    }  
   }


   submitSelected() {
    const selected = this.selection.selected[0]; 
    console.log(selected);
    this.dialogRef.close({data: selected});
  }
}
