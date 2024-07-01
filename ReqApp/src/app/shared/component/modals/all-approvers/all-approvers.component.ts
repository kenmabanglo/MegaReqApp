import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { debounceTime, distinctUntilChanged, fromEvent, map, tap } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { UserService } from '../../../service';
import { PaginatedResponse, User } from '../../../interface';  
import { AuthenticationService } from 'src/app/core/service/authentication.service';

@Component({
  selector: 'app-all-approvers',
  templateUrl: './all-approvers.component.html',
  styleUrls: ['./all-approvers.component.scss']
})
export class AllApproversComponent implements OnInit, AfterViewInit {
  
  users: User[]; 
  page = 1;
  limit = 10;
  filter = '';
  searchKey: string = "";
  isLoading = true;

  filterValue: string = null;
  dataSource: MatTableDataSource<PaginatedResponse> = null;
  pageEvent: PageEvent;
  displayedColumns: string[] = ['select','fullName','branchCode','positionName'];
  selected = {};
  selection = new SelectionModel<PaginatedResponse>(false, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('search') input: ElementRef;
  totalPage: number;
  hiddenClose: boolean = true;
  user: User;

  constructor(
    private _userData: UserService,
    private http: HttpClient,
    private router: Router, 
    private activatedRoute: ActivatedRoute,
    public dialogRef: MatDialogRef<AllApproversComponent>, 
    @Inject(MAT_DIALOG_DATA) public passedData: any,
    private auth: AuthenticationService    
    ) {
        this.auth.user.subscribe(x => this.user = x); 
    }

    ngOnInit() { 
      this.dataSource = new MatTableDataSource();
      this.initDataSource();
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

  initDataSource(page:number=0, size: number=10, search: string="") {
    this.isLoading = true;
   console.log(this.passedData);
    this._userData.getAllApprovers({
      pageIndex: page, 
      pageSize: size, 
      search:search,
      userName:  this.passedData.userName.trim(), 
    })
    .pipe( 
      map((res: PaginatedResponse) =>{
        this.isLoading = false;
        this.totalPage = res.page.total;
        this.dataSource = res.page.data;
      })
    ).subscribe();
  }

  onPaginateChange(event: PageEvent) {
    let page = event.pageIndex;
    let size = event.pageSize;

    page = page +1;

    this.initDataSource(page, size);
  } 
 
  selectedRow(row) {
    this.selected = row;
  }
  
  clearSearch() {
    const input = this.input.nativeElement.value;
    if (input != "") {
      this.input.nativeElement.value = "";
      this.hiddenClose = true;
      this.initDataSource();
    }  
  }

    /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  submitSelected() {
    const selected = this.selection.selected[0]; 
    this.dialogRef.close({data: selected});
  }

 

}
