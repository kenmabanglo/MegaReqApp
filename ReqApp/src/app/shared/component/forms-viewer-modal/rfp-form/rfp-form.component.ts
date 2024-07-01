import { ChangeDetectorRef, Component, Inject, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { RequestService } from 'src/app/shared/service';
import { PrintService } from 'src/app/shared/service/print.service';
import { AttachmentsViewerComponent } from '../../attachments-viewer/attachments-viewer.component';
import { data } from 'jquery';

@Component({
  selector: 'app-rfp-form',
  templateUrl: './rfp-form.component.html',
  styleUrls: ['./rfp-form.component.scss']
})
export class RfpFormComponent implements OnInit {
  @ViewChildren('requested') renderedRequest: QueryList<any>;
  datas:any;
  itemRows = new Array(0);
  processing = true;
  approvers:any=[];
  status = '';
  grand_total = 0;

  constructor( 
    private _requestData: RequestService,
    private _print: PrintService,
    private dialog: MatDialog,
    private ref: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public passedData: any,
    public dialogRef: MatDialogRef<RfpFormComponent>) { }

    ngOnInit(): void {
      this.setModalInitialDatas();
    }
  
    setModalInitialDatas() {
      const d = this.passedData;
       
      this._requestData.getRequestDetails(d.requestNo, d.branchCode, d.requestTypeCode)
      .subscribe((result: any) => {   
          let total_lineheight = 0;
         this.datas = result.requestHdr;  
         this.datas.approvers = result.approvers;   
          this.processing = false;  
  
          this.approvers_status(this.datas);
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

        //  if (a == 'Y') { approved +=1; stat = 'approved'}
        //  if (a == 'N') { rejects+=1; stat = 'rejected' }
        //  if (a == null) { pending+=0; stat = 'pending' }
        
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
