import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { debounceTime, distinctUntilChanged, fromEvent, map, tap } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { PaginatedResponse, SupplierMaster } from '../../../interface';
import { SupplierService } from '../../../service';

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.scss']
})
export class SuppliersComponent implements OnInit, AfterViewInit {
  
  suppliers: SupplierMaster[];
  // total = 0;
  page = 1;
  limit = 100;
  pageSize = 100;
  filter = '';
  searchKey: string = "";
  isLoading = true;

  filterValue: string = null;
  dataSource: MatTableDataSource<PaginatedResponse> = null;
  pageEvent: PageEvent;
  displayedColumns: string[] = ['select','supplierCode','company'];
  selected = {};
  selection = new SelectionModel<PaginatedResponse>(false, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('search') input: ElementRef;
  totalPage: number;
  hiddenClose: boolean = true;
  suppliercodes = "";
  constructor(
    private _supplierData: SupplierService,
    private http: HttpClient,
    private router: Router, 
    private activatedRoute: ActivatedRoute,
    public dialogRef: MatDialogRef<SuppliersComponent>
    ) { }

    ngOnInit() {
      // this.suppliers = this.activatedRoute.snapshot.data["suppliers"];
      this.dataSource = new MatTableDataSource();
   
      this.initDataSource(1,10,'',10);
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

  initDataSource(page:number=0, size: number=10, search="", limit=this.limit) {
    this.isLoading = true;
    this._supplierData.findAll(page, size, search, limit).pipe(
      // tap(datas => console.log(datas)),
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
    const input = this.input.nativeElement.value;
    this.initDataSource(page, size, input);
  } 
 

  selectedRow(row) {
    // console.log(row);
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

  submitSelectedSupplier() {
    const selected = this.selection.selected[0];
    this.dialogRef.close({data: selected});
  }

 

}
