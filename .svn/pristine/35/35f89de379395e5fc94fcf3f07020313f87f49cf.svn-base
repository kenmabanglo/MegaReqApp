import { ChangeDetectorRef, Component, Inject, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { PrintService, RequestService } from '../../service/';
import { AttachmentsViewerComponent } from '../attachments-viewer/attachments-viewer.component';
@Component({
  selector: 'app-request-viewer',
  templateUrl: './request-viewer.component.html',
  styleUrls: ['./request-viewer.component.scss']
})
export class RequestViewerComponent implements OnInit {
  @ViewChildren('requested') renderedRequest: QueryList<any>;
  
  datas:any;
  itemRows = new Array(0);
  processing = true;
  approvers:any=[];
  status = '';
  grand_total = 0;
  item_columns = []; 
  // dynamicItems = dynamic_items;

  constructor( 
    private _requestData: RequestService,
    private _print: PrintService,
    private dialog: MatDialog,
    private ref: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public passedData: any,
    public dialogRef: MatDialogRef<RequestViewerComponent>) { }

  ngOnInit(): void {
    this.setModalInitialDatas();
  }

  setDynamicItemsColumns() {
    // const dynamic_items = this.dynamicItems; 

  }

  setModalInitialDatas() {
    const d = this.passedData;
     
    this._requestData.getRequestDetails(d.requestNo, d.branchCode, d.requestTypeCode)
    .subscribe((result: any) => {    
        let total_lineheight = 0;
        this.datas = result.requestHdr;
        this.datas.approvers = result.approvers;        
        this.datas.requestItems = result.requestItems;
        this.processing = true; 
        if(this.datas.requestItems) {
          this.grand_total = result.totalAmount
        }
        this.approvers_status(this.datas);

        // process row height
        this.renderedRequest.changes.subscribe((t) => { 

        setTimeout(()=>{ 

          var tb = document.querySelector('#items-table') as HTMLTableElement || null; 
          tb.style.visibility = 'none';
          const element:  NodeListOf<HTMLTableCellElement> = document.querySelectorAll('td.td-description');
         // console.log(element);
          let lh = 16; 
          let lineheight:any = 16; 

          for (let index = 0; index < this.datas.requestItems.length; index++) {
              if (element !== null) {
  
                let height = element[index].getBoundingClientRect().height;
                // const width = element[index].getBoundingClientRect().width;
                if (height == 3) height = 1;
                else height = height - 3;
  
                if (lineheight === '') {
                  total_lineheight += Math.round(height/lh);
                }
                else {
                  // console.log('lh',lh);
                  // console.log('Math.floor(height)',Math.floor(height));
                  // console.log('Math.floor(height/lh)',Math.floor(height));
                  total_lineheight += Math.floor(height/lh);
                } 
               // console.log('height',height, 'total_lineheight',total_lineheight);
            } 
          }
          total_lineheight = total_lineheight/2;
          if (total_lineheight > 0 && total_lineheight < 11) {
           this.itemRows = Array(11 - total_lineheight);
         }
            //console.log('itemRows: ', this.itemRows.length); 
            tb.style.visibility = 'visible';
            //console.log('total_lineheight:', total_lineheight);
            this.processing = false;
        }, 2000);
       
        }); 
     }); 
  }

  approvers_status(res) {
    let approver = 0; let approved = 0; let rejects = 0;let pending = 0;
    let apps = [];
     for (let i = 1; i <= 5; i++) {
       const d = res; const app = res.approvers;
       const r = app['name'+i];
       const a = d['approved'+i]; 
       let c; let s;
       let stat;
       if (r != null) {
         approver+=1; 
         // immediate head
        
         apps.push({
          index:i,
          approver: r,
          status: a == 'Y'? 'approved':(a=='N'?'rejected':'pending')
        }); 
       }  
     } 
     this.approvers = apps;

     let s;  
     if (approved > 0)  s = 'Approved'; 
     else  s = 'Pending'; 
     if (rejects > 0)  s = 'Rejected'; 
 
   // this.status = s;
  }

  print() {
    this._print.print(this.passedData.requestTypeCode);
  }

  viewAttachments() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '100%'; 

    dialogConfig.data = this.passedData;
  
    dialogConfig.panelClass = ['modal-table-pane'];
     
    this.dialog.open(
      AttachmentsViewerComponent, dialogConfig
    );

  }

}
