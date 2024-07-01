import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, distinctUntilChanged, fromEvent, map, tap } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { UserService } from '../../../service';
import { PaginatedResponse, DivisionMaster } from '../../../interface';

@Component({
  selector: 'app-all-branches',
  templateUrl: './all-branches.component.html',
  styleUrls: ['./all-branches.component.scss']
})
export class AllBranchesComponent implements OnInit, AfterViewInit {

  branches: DivisionMaster[] = [];
  page = 1;
  limit = 10;
  filter = '';
  searchKey: string = "";
  isLoading = true;

  filterValue: string = null;
  dataSource: MatTableDataSource<PaginatedResponse> = null;
  pageEvent: PageEvent;
  displayedColumns: string[] = ['select', 'divisionCode', 'divisionName'];
  selected = {};
  selection = new SelectionModel<PaginatedResponse>(false, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('search') input: ElementRef;
  totalPage: number;
  hiddenClose: boolean = true;

  constructor(
    private _userData: UserService,
    public dialogRef: MatDialogRef<AllBranchesComponent>,
    @Inject(MAT_DIALOG_DATA) public passedData: any
  ) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource();
    this.initDataSource();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.hiddenClose = false;
          this.initDataSource(0, 10, this.input.nativeElement.value);
        })
      )
      .subscribe();
  }

  initDataSource(page: number = 0, size: number = 10, search: string = "") {
    this.isLoading = true;
    const branchCode = this.passedData?.branchCode?.trim() || '';
    //console.log(this.passedData);
    //console.log('Init Data Source:', page, size, search, branchCode);
    this._userData.getAllBranches({
      pageIndex: page,
      pageSize: size,
      search: search,
      branchCode: branchCode,
    })
      // .subscribe((res: PaginatedResponse) => {
      //  console.log('Response:', res);
      //  this.isLoading = false;
      //  this.totalPage = res.page.total;
      //  this.dataSource.data = res.page.data;
      //  console.log('Data Source:', this.dataSource);
      //}, err => {
      //  this.isLoading = false;
      //  console.error('Error fetching data:', err);
      //});
      .pipe(
        map((res: PaginatedResponse) => {
          this.isLoading = false;
          this.totalPage = res.page.total;
          this.dataSource = res.page.data;
        })
      ).subscribe();
  }

  onPaginateChange(event: PageEvent) {
    let page = event.pageIndex;
    let size = event.pageSize;

    page = page + 1;

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

  submitSelected() {
    const selected = this.selection.selected[0];
    this.dialogRef.close({ data: selected });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }
}
