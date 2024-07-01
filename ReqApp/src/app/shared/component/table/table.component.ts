import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table'; 
import { TableColumn } from 'src/app/shared/interface/table-column';
import requestTypes from 'src/app/core/data/request-type-master.json';
import { ConfirmDialogPopupService, ViewMasterService } from '../../service';
import { map, Observable, startWith } from 'rxjs';
import { DivisionMaster, User } from '../../interface';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AssignBranchModalComponent } from './assign-branch-modal/assign-branch-modal.component';
import { ChangePasswordModalComponent } from './change-password-modal/change-password-modal.component';
// import branchesJson from 'src/app/core/data/branches.json';
import positionRanksJson from 'src/app/core/data/position-ranks.json';
import { ActivateUserModalComponent } from './activate-user-modal/activate-user-modal.component';

@Component({
  selector: 'table-widget',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements AfterViewInit {
  
  public tableDataSource = new MatTableDataSource([]);
  public displayedColumns: string[];
  public request_types = requestTypes;

  _totalItems: number;
  hiddenClose: boolean = true;
  hiddenCloseBranch: boolean = true;

  @Input() isPageable = false;
  @Input() isSortable = false;
  @Input() isFilterable = false;
  @Input() requestTypeFilter = false;
  @Input() tableColumns: TableColumn[];
  @Input() rowActionIcon: string[]= ['add_location','lock','verified_user','power_settings_new'];
  @Input() paginationSizes: number[] =  [10,20,30];
  @Input() defaultPageSize = this.paginationSizes[1];
  @Input() tableSettings = {title:'',icon:''};
  @Input() status = '';

  @ViewChild(MatPaginator, {static: true}) matPaginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) matSort: MatSort;
  @ViewChild('search') input: ElementRef;
  @ViewChild('searchB') sbInput: ElementRef;
  
  @Output() sort: EventEmitter<Sort> = new EventEmitter();
  @Output() rowAction: EventEmitter<any> = new EventEmitter<any>();
  @Output() page: EventEmitter<PageEvent> = new EventEmitter();
  @Output() search = new EventEmitter<any>();
  @Output() branch = new EventEmitter<String>();
  @Output() clearBt = new EventEmitter<any>();
  @Output() assign = new EventEmitter<any>();
  @Output() changepass = new EventEmitter<any>();
  @Output() update = new EventEmitter<any>();
  // @Output() storeBased = new EventEmitter<any>();

  branches:DivisionMaster[] = [];   
  filteredOptions: Observable<DivisionMaster[]>;

  searchBranch = new FormControl<string | DivisionMaster>('');
  positionRanks: string[] = positionRanksJson;

  @Input() set totalItems(value: number) 
  { 
    if (value != undefined) {
      this._totalItems = value; 
    }
  } 
  
  get totalItems() { return this._totalItems; }
  
  // this property needs to have a setter, to dynamically get changes from parent component
  @Input() set tableData(data: any[]) {
      this.setTableDataSource(data);
  }

  constructor(private vwMaster: ViewMasterService, private dialog: MatDialog,
    private confirmDialog: ConfirmDialogPopupService,) {
  }

  ngOnInit(): void {
    const columnNames = this.tableColumns.map((tableColumn: TableColumn) => tableColumn.name);
    if (this.rowActionIcon.length > 0) {
      this.displayedColumns = [...columnNames,'Actions'];
       
    } else {
      this.displayedColumns = columnNames;
    }  
  }

  displayFn(branch: DivisionMaster): string | undefined {
    return branch && branch.divisionName ? branch.divisionName : undefined;
  }

  private _filter(name: string): DivisionMaster[] {
    const filterValue = name.toLowerCase();
    return this.branches.filter(option => option.divisionName.toLowerCase().includes(filterValue));
  }

  // we need this, in order to make pagination work with *ngIf
  ngAfterViewInit(): void {  
    this.tableDataSource.paginator = this.matPaginator;
    this.getBranches();
  }

  setTableDataSource(data: any) {
      this.tableDataSource = new MatTableDataSource<any>(data); 
      this.tableDataSource.paginator = this.matPaginator;
      this.tableDataSource.sort = this.matSort; 
  }
  // search
  applyFilter(event: Event) { 
    console.log()
    const filterValue = (event.target as HTMLInputElement).value;
    this.hiddenClose = false; 
    this.search.emit({search: filterValue,branchCode: this.searchBranch.value});
  }

  applyFilterBranch(event) {  
    //console.log(event);
    let filterValue;
    if (event.type == "input") {
      filterValue = (event.target as HTMLInputElement).value;
    }
    else {
      filterValue = event.option.value.divisionCode;
    }
   
    this.hiddenCloseBranch = false; 
    this.branch.emit(filterValue);
  }

  clearSearchBranch() {
    const input = this.sbInput.nativeElement.value;
    if (input != "") {
      this.sbInput.nativeElement.value = "";
      this.hiddenCloseBranch = true;
      this.searchBranch.setValue("",{emitEvent: true});
      this.branch.emit("");
    }  
   }

  clearSearch() {
    const input = this.input.nativeElement.value;
    if (input != "") {
      this.input.nativeElement.value = "";
      this.hiddenClose = true;
      this.clearBt.emit(true);
    }  
   }

   refresh() {
    // this.clearBt.emit(true);
    let filterValue = this.input.nativeElement.value;
    console.log(filterValue);
    this.search.emit({search: filterValue,branchCode: this.searchBranch.value});
   }

  sortTable(sortParameters: Sort) {
    if (this.isSortable) {
      // defining name of data property, to sort by, instead of column name
      sortParameters.active = this.tableColumns.find(column => column.name === sortParameters.active).dataKey;
      this.sort.emit(sortParameters);
    }
  }

  emitRowAction(action,row: any) { 
    if (action == 'add_location')
      this.addBranch(row); 
    else if (action == 'lock')
      this.changePass(row);
    else if (action == 'verified_user') {
      if (row['active'] == 0) {

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.width = "60%";  
        const data = {
          userName: row.userName, 
          fullName: row.fullName,
          positionName: row.positionName,
          storeBased: row.storeBased,
          positionRanks: this.positionRanks
        };
        console.log(data);
        dialogConfig.panelClass = ['modal-table-pane'];

        dialogConfig.data = data;
        const dialogRef = this.dialog.open(ActivateUserModalComponent,dialogConfig);
        dialogRef.afterClosed().subscribe( data => {
          if (data) {  
            data.action = action;
            this.update.emit(data);
          }

        });
        

      //   this.confirmDialog.openConfirmDialog('Click yes to activate this user ('+row['userName']+')')
      //  .afterClosed().subscribe(save => {
 
      //    if (save) { 
          
      //    }

      //   });
      } 
    }
    else if (action == 'store') {
        this.confirmDialog.openConfirmDialog('Click yes to change user to office based. ('+row['userName']+')')
       .afterClosed().subscribe(save => {
         if (save) { 
          row.action = action;
          this.update.emit(row);
         }

        });
    }
    // deactivate
    else if (action == 'power_settings_new') {
      this.confirmDialog.openConfirmDialog('Are you sure you want to deactivate this account? ('+row['userName']+')')
      .afterClosed().subscribe(save => {
        if (save) { 
         row.action = action;
         this.update.emit(row);
        } 
       });
    }
  }

  addBranch(row: User) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";  
    const data = {
      userName: row.userName, 
      branches: this.branches.slice(1)
    };

    dialogConfig.panelClass = ['modal-table-pane'];

    dialogConfig.data = data;
    const dialogRef = this.dialog.open(AssignBranchModalComponent,dialogConfig);
    dialogRef.afterClosed().subscribe( data => {
      if (data) {  
        this.assign.emit(data); 
      }

    });
  }

  changePass(row: User) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";  
    const data = {
      userName: row.userName,
      email: row.userName.trim() + '@1stmegasaver.com.ph'
    };

    dialogConfig.panelClass = ['modal-table-pane'];

    dialogConfig.data = data;
    const dialogRef = this.dialog.open(ChangePasswordModalComponent,dialogConfig);
    dialogRef.afterClosed().subscribe( data => {
      if (data) {  
        this.changepass.emit(data); 
      }
    });
  }
  getRanks() {

  }

  getBranches() {
    this.vwMaster.divisionMaster()
    .subscribe({
      next: (res) => {
        this.branches = res;
        // check no branch existence
        var exist = this.branches.filter(x=>x.divisionCode == 'NO BRANCH');
        if (exist.length == 0) {
          const nobranch = {
            divisionName: 'NO BRANCH',
            divisionCode:'NO BRANCH',
            companyCode: ''
           };
           
           this.branches.unshift(nobranch); 
        }
       
       Object.keys(this.branches).forEach((key: string)=> {
        const divName = this.branches[key]['divisionName'];
         
        //this.branches[key]['divisionName'] = divName.replace(/TARLAC MAC ENTERPRISES, INC.|TARLAC MAC ENTERPRISES - |1st MEGASAVER - |1st MEGASAVER |(|)/gi,"");
         // Ken - 6/25/2024
         this.branches[key]['divisionName'] = divName.replace(/TARLAC MAC ENTERPRISES, INC.|TARLAC MAC ENTERPRISES - |1st MEGASAVER - |1st MEGASAVER |Cooling Industries Corp./gi, "");
        this.searchBranch.setValue("",{emitEvent: true});

        this.filteredOptions = this.searchBranch.valueChanges.pipe(
          startWith(''),
          map(value => {
            const name = typeof value === 'string' ? value : value?.divisionName;
            return name ? this._filter(name as string) : this.branches.slice();
          }),
        );
      
      });
      },
      error: (err) => {
        // this.notif.error(err.message);
      }
    });
  }

}