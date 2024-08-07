import { ChangeDetectorRef, Component, Inject, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { RequestService } from 'src/app/shared/service';
import { PrintService } from 'src/app/shared/service/print.service';
import { AttachmentsViewerComponent } from '../../attachments-viewer/attachments-viewer.component';

@Component({
  selector: 'app-adb-form',
  templateUrl: './adb-form.component.html',
  styleUrls: ['./adb-form.component.scss']
})
export class AdbFormComponent implements OnInit {

  @ViewChildren('requested') renderedRequest: QueryList<any>;
  datas:any;
  itemRows = new Array(20);
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
    public dialogRef: MatDialogRef<AdbFormComponent>) { }

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
        if(this.datas.recommendation) {
          this.datas.recommendation = this.datas.recommendation.replaceAll('+CHAR(13)+CHAR(10)+',"<br>")
        }
        this.datas.requestItems = result.requestItems;
        this.processing = true; 

        if(this.datas.requestItems) {
          // this.grand_total = this.datas.requestItems.map(x=>x['totalPrice']).reduce((psum,a)=> psum + a,0);
          this.grand_total = result.totalAmount
        }

        this.approvers_status(this.datas);
      //  console.log(result);
        // process row height
        this.renderedRequest.changes.subscribe((t) => { 
          console.log("rendered");
          setTimeout(()=> { 
           
            var tb = document.querySelector('#adb-tb') as HTMLTableElement || null; 
              tb.style.visibility = 'none';
              const element:  NodeListOf<HTMLTableCellElement> = document.querySelectorAll('td.description');
          
              let lh = 16; 
              let lineheight:any = 16; 

              for (let index = 0; index < this.datas.requestItems.length; index++) {
                  if (element !== null) {

                    let height = element[index].getBoundingClientRect().height;
                    const width = element[index].getBoundingClientRect().width;

                    //console.log(height);

                    if (height == 3) height = 1;
                    else height = height - 3;

                    if (lineheight === '') {
                      total_lineheight += Math.round(height/lh);
                    }
                    else {
                     // console.log(Math.floor(height/lh));
                      total_lineheight += Math.floor(height/lh);
                    } 
                   // console.log(height, width, total_lineheight);
                } 
              }
              if (total_lineheight > 0 && total_lineheight < 11) {
                this.itemRows = Array(11 - total_lineheight);
              }
              tb.style.visibility = 'visible';
              //console.log(total_lineheight);
              this.processing = false;
          }, 200);
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

}
