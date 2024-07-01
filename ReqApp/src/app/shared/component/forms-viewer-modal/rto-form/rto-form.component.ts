import { ChangeDetectorRef, Component, Inject, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { RequestService, UserService } from 'src/app/shared/service';
import { PrintService } from 'src/app/shared/service/print.service';
import { AttachmentsViewerComponent } from '../../attachments-viewer/attachments-viewer.component';
import { AuthenticationService } from 'src/app/core/service';

@Component({
  selector: 'app-rto-form',
  templateUrl: './rto-form.component.html',
  styleUrls: ['./rto-form.component.scss']
})
export class RTOFormComponent implements OnInit {
  @ViewChildren('requested') renderedRequest: QueryList<any>;
  datas:any;
  itemRows = new Array(0);
  processing = true;
  approvers:any=[];
  status = '';
  grand_total = 0; closed:string='';
  user:any=[];

  constructor( 
    private _requestData: RequestService,
    private _print: PrintService,
    private auth: AuthenticationService,
    private dialog: MatDialog,
    private ref: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public passedData: any,
    public dialogRef: MatDialogRef<RTOFormComponent>) { 
      this.auth.user.subscribe(x => this.user = x);
    }

  ngOnInit(): void {
    this.setModalInitialDatas();
  }

  setModalInitialDatas() {
    const d = this.passedData;
     
    this._requestData.getRequestDetails(d.requestNo, d.branchCode, d.requestTypeCode)
    .subscribe((result: any) => {   
        let total_lineheight = 0;
        this.datas = result.requestHdr;
        this.closed = result.requestHdr.closed;
        this.datas.approvers = result.approvers;    
        this.datas.requestItems = result.requestItems;
        this.processing = true; 
       
        if(this.datas.requestItems) {
          // this.grand_total = this.datas.requestItems.map(x=>x['totalPrice']).reduce((psum,a)=> psum + a,0);
          this.grand_total = result.totalAmount
        }
        this.approvers_status(this.datas);

        // process row height
        this.renderedRequest.changes.subscribe((t) => { 

        setTimeout(() => { 
            
         const tbody = document.querySelector('tbody.items') as HTMLTableElement || null; 
         var rstb = document.querySelector('#rto-tb') as HTMLTableElement || null; 
         rstb.style.visibility = 'none';
         const element:  NodeListOf<HTMLTableCellElement> = document.querySelectorAll('td.td-description');
         
        //  let lh = 16; 
        //  let lineheight:any = 16; 

        //  for (let index = 0; index < this.datas.requestItems.length; index++) {
        //     if (element !== null) {

        //       let height = element[index].getBoundingClientRect().height; 

        //       if (height == 3) height = 1;
        //       else height = height - 3;

        //       if (lineheight === '') {
        //         total_lineheight += Math.round(height/lh);
        //       }
        //       else { 
        //         total_lineheight += Math.floor(height/lh);
        //       }  
        //       // console.log(height,lh,Math.floor(height/lh))
        //    } 
        //  }
        //  total_lineheight = total_lineheight/2;
        //   if (total_lineheight > 0 && total_lineheight < 11) {
        //    this.itemRows = Array(11 - total_lineheight);
        //  }
         //console.log('this.itemRows', this.itemRows.length);

            this.itemRows = Array(11 - this.datas.requestItems.length);
            rstb.style.visibility = 'visible'; 
            this.processing = false;
        }, 500);
       
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
    this._print.print();
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

  edit() {
    
  }
}
