import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmDialogPopupService, NotificationService, RequestService } from '../../service';
import { ApproversComponent } from '../modals';

@Component({
  selector: 'app-approve-request',
  templateUrl: './approve-request.component.html',
  styleUrls: ['./approve-request.component.scss']
})
export class ApproveRequestComponent implements OnInit {
 
  approveForm = new FormGroup({
    recommendation:new FormControl(''),
    approver: new FormControl(''),
    approverName: new FormControl('')
  });
  lastApprover: boolean = true; 

  constructor(
    public dialog: MatDialog,
    private notif: NotificationService,
    private confirmDialog: ConfirmDialogPopupService,
    private request: RequestService,
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<ApproveRequestComponent>
    ) { }

  ngOnInit(): void {
   
    //this.lastApprover = true;
    this.data.next = false;
    // check last approver
    this.request.isFinalApprover(this.data.approver,this.data.amount, this.data.approverNum)
    .subscribe({
      next:(data:any) => {
        this.lastApprover = data.dataSet;

        this.approveForm.get('approver').clearValidators();
        this.approveForm.get('approverName').clearValidators();

        if (!this.lastApprover && this.data.requestTypeCode != 'FL')
        {
          this.approveForm.get('approver').setValidators(Validators.required);
          this.approveForm.get('approverName').setValidators(Validators.required);
         
        }

        this.approveForm.get('approver').markAsPristine();
        this.approveForm.get('approver').markAsUntouched(); 
        this.approveForm.get('approver').updateValueAndValidity(); 
        this.approveForm.get('approverName').markAsPristine();
        this.approveForm.get('approverName').markAsUntouched(); 
        this.approveForm.get('approverName').updateValueAndValidity();
      },
      error: (err) => {

      }
    })
   

  }

  openSearch(event) {
    console.log(this.data);
    event.preventDefault();
    const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.width = '100%';
      dialogConfig.panelClass = ['modal-table-pane'];

      dialogConfig.data = {
        appnum: this.data.approverNum + 1,
        reqType: this.data.requestTypeCode,
        branchCode: this.data.branchCode,
        estimatedAmt: this.data.amount
      }
      //console.log(this.data);
      //console.log(dialogConfig.data);
      const dialogRef = this.dialog.open(ApproversComponent, dialogConfig); 
      dialogRef.afterClosed().subscribe(result => { 
        if (result) {
          this.approveForm.patchValue({
            approver: result.data.userName,
            approverName: result.data.fullName
          }); 
        }
      });
  }

  submitApprove() { 
    if (this.approveForm.invalid) {
      Object.keys(this.approveForm.controls).forEach(field => {
        const control = this.approveForm.get(field);          
        control.markAsTouched({ onlySelf: true });    
      });
      this.notif.error("Please select your final approver!"); 
    }
    else {
      const data = this.approveForm.getRawValue();
      this.dialogRef.close(
        {
          recommendation: data.recommendation,
          finalApprover: this.lastApprover,
          next_approver: data.approver.trim(),
          ok: true, 
          approve: this.data.approve
        });
    } 
  }

}
