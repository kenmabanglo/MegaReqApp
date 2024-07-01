import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { AuthenticationService } from 'src/app/core/service';
import { RequestTypeMaster, User } from 'src/app/shared/interface';
import { TableColumn } from 'src/app/shared/interface/table-column';
import requestTypes from 'src/app/core/data/request-type-master.json';

@Component({
  selector: 'app-request-type',
  templateUrl: './request-type.component.html',
  styleUrls: ['./request-type.component.scss']
})
export class RequestTypeComponent implements OnInit {
  datas: RequestTypeMaster[];
  tableColumns: TableColumn[];

  constructor(){} 

  ngOnInit(): void {
    this.initializeColumns();
    this.datas = this.getDatas(); 
  }

  initializeColumns(): void {
    this.tableColumns = [
      {
        name: 'Request',
        dataKey: 'requestTypeCode',
        position: 'left',
        isSortable: false
      },
      {
        name: 'Description',
        dataKey: 'requestTypeName',
        position: 'left',
        isSortable: false
      }
    ];
  }

  getDatas(): any[] {
    return requestTypes;
  }

}
