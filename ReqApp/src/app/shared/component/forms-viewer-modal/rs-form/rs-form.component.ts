import { Component, Inject, Input, OnInit, QueryList, ViewChildren, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { map, Observable, Subject } from 'rxjs';
import { LabelColors, LabelStatusColors, StatusIcons } from 'src/app/core/constants/_label_colors';
import { RequestService } from 'src/app/shared/service';
import { PrintService } from 'src/app/shared/service/print.service';
import { AttachmentsViewerComponent } from '../../attachments-viewer/attachments-viewer.component';

@Component({
  selector: 'app-rs-form',
  templateUrl: './rs-form.component.html',
  styleUrls: ['./rs-form.component.scss']
})
export class RsFormComponent implements OnInit {
  @ViewChildren('requested') renderedRequest: QueryList<any>;

  datas:any;
  itemRows = new Array(0);
  processing = false;

  rendered: boolean=false;
  status = '';
  attachments:[] = [];
  approvers:any=[];

  public labelColors =  LabelColors;
  public statColors =  LabelStatusColors;
  public statIcons =  StatusIcons;

  constructor(
    private _requestData: RequestService,
    private _print: PrintService,
    private dialog: MatDialog,
    private ref: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public passedData: any,
    public dialogRef: MatDialogRef<RsFormComponent>
  ) { }

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
          this.datas.requestItems = result.requestItems;
          this.datas.supplier = result.supplier;
          this.processing = true;

          this.approvers_status(this.datas);

          // process row height
          this.renderedRequest.changes.subscribe((t) => { 

          setTimeout(()=>{ 
             
          // //console.log('here');
          const tbody = document.querySelector('tbody.items') as HTMLTableElement || null; 
          var rstb = document.querySelector('#rs-tb') as HTMLTableElement || null; 
          rstb.style.visibility = 'none';
           const element:  NodeListOf<HTMLTableCellElement> = document.querySelectorAll('td.td-description');
           
           let lh = 16; //16
           let lineheight:any = 16; //16
           total_lineheight=this.datas.requestItems.length;
          //  for (let index = 0; index < this.datas.requestItems.length; index++) {
          //     if (element !== null) {
 
          //       //element[index].style.lineHeight = lineheight + 'px';

          //       const height = element[index].getBoundingClientRect().height;
          //       const width = element[index].getBoundingClientRect().width;

          //       if (lineheight === '') {
          //         total_lineheight += Math.round(height/lh);
          //       }
          //       else {
          //         total_lineheight += Math.floor(height/lh);
          //       }
                
          //       console.log(height,total_lineheight, lh);
          //     } 
          //  }
            //total_lineheight = total_lineheight/2;
            //console.log(total_lineheight);
              if (total_lineheight > 0 && total_lineheight < 11) {
             this.itemRows = Array(11 - total_lineheight);
           }
           this.itemRows
           rstb.style.visibility = 'visible';
           console.log( this.itemRows);

              this.processing = false;
           }, 300);
        

          }); 

          this.ref.detectChanges();
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
