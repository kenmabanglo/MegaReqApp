import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { fromEvent, debounceTime, distinctUntilChanged, tap } from 'rxjs';
import { AuthenticationService } from 'src/app/core/service';
import { PaginatedResponse, User } from 'src/app/shared/interface';
import { RequestService } from 'src/app/shared/service';

@Component({
  selector: 'app-reference-adb',
  templateUrl: './reference-adb.component.html',
  styleUrls: ['./reference-adb.component.scss']
})
export class ReferenceAdbComponent implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<PaginatedResponse> = null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('search') input: ElementRef;
  
  hiddenClose: boolean = true;
  isLoading: boolean = true;
  totalPage: number;
  pageEvent: PageEvent;

  page = 1;
  limit = 10;
  pageSize = 10;
  user:User;
  displayedColumns: string[] = ['select','branchCode','requestNo','createdByName','requestDate'];
  selected = {};
  selection = new SelectionModel<PaginatedResponse>(false, []);

    constructor(
      private request: RequestService,
    private auth: AuthenticationService,
    public dialogRef: MatDialogRef<ReferenceAdbComponent>
      ) { 
        this.auth.user.subscribe(x => this.user = x); 
    }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource();
   
    this.initDataSource(1,10,'');
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
    const input = this.input.nativeElement.value;
    this.initDataSource(page, size, input);
  } 

  initDataSource(page:number=0, size: number=10, search="") {
    this.request.findAllADBNo(page,size,this.user.branchCode,search)
    .subscribe({
      next: (res) => {
        this.isLoading = false;
        this.totalPage = res.page.total;
        this.dataSource = res.page.data;
      },
      error: (err) => {

      }
    });
  }

  clearSearch() {
    const input = this.input.nativeElement.value;
    if (input != "") {
      this.input.nativeElement.value = "";
      this.hiddenClose = true;
      this.initDataSource();
    }  
   }

  submit() {
    const selected = this.selection.selected[0];
    //console.log(selected);
    this.dialogRef.close({data: selected['requestNo'] } );
  }

}
