import { SelectionModel } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { fromEvent, debounceTime, distinctUntilChanged, tap, map } from 'rxjs';
import { PaginatedResponse } from '../../../interface';
import { ItemMaster } from '../../../interface/item-master-interface';
import { ViewMasterService } from '../../../service'; 

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent implements OnInit {
  items: ItemMaster[];
  page = 1;
  limit = 100;
  pageSize = 10;
  filter = '';
  searchKey: string = "";
  isLoading = true;

  filterValue: string = null;
  dataSource: MatTableDataSource<PaginatedResponse> = null;
  pageEvent: PageEvent;
  displayedColumns: string[] = ['select','itemCode','itemName','serialized'];
  selected = {};
  selection = new SelectionModel<PaginatedResponse>(false, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('search') input: ElementRef;
  totalPage: number;
  hiddenClose: boolean = true;
  itemcodes: any;
  supplierCode = "";
  constructor(
    private _viewData: ViewMasterService,
    private http: HttpClient,
    private router: Router, 
    private activatedRoute: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public passedData: any,
    public dialogRef: MatDialogRef<ItemsComponent>,
    ) { }

    ngOnInit() { 
      this.dataSource = new MatTableDataSource();

      if (this.passedData) {
        if (this.passedData.selectedItemcodes) {
          this.itemcodes = this.passedData.selectedItemcodes.join("','");
        }
       
        if (this.passedData.supplierCode != null) {
          this.supplierCode = this.passedData.supplierCode;
        }
      }
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

  initDataSource(page:number=0, size: number=10, search: string="", limit=this.limit) {
    this.isLoading = true;
    this._viewData.findAll('itemmaster',page, size, search,limit, this.supplierCode).pipe(
      tap(datas => console.log()),
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
  
  clearSearch() {
    const input = this.input.nativeElement.value;
    if (input != "") {
      this.input.nativeElement.value = "";
      this.hiddenClose = true;
      this.initDataSource();
    }  
   }

  submitSelected() {
    const selected = this.selection.selected[0];
    // console.log(selected);
    selected['cost'] = 0;
    this.dialogRef.close({data: selected});
  }


}
