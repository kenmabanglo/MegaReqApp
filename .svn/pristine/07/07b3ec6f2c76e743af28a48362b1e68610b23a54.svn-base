import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectionList } from '@angular/material/list';
import { NotificationService, UserService } from 'src/app/shared/service';
import { TableComponent } from '../table.component';

@Component({
  selector: 'app-assign-branch-modal',
  templateUrl: './assign-branch-modal.component.html',
  styleUrls: ['./assign-branch-modal.component.scss']
})
export class AssignBranchModalComponent implements OnInit {
 @ViewChild('branchesSel') optionsSelectionList: MatSelectionList;
  errorMsg: string = ""; responseMsg: string = "";
  isSaving: boolean = false;  
  selected: string="";
  
  constructor( 
    private notif: NotificationService,
    private dialogRef: MatDialogRef<AssignBranchModalComponent>,
    @Inject(MAT_DIALOG_DATA) public passedData: any
  ) { 
    
  }

  ngOnInit(): void {
  }
  onSelectionChange() {
    const selected = this.optionsSelectionList.selectedOptions.selected
    .map(s => s.value); 
    this.selected = selected[0]['divisionCode'];
  }
  onSubmit() {   
    if (this.selected == '') {
      this.notif.error("No branch selected");
    }
    else {
      this.dialogRef.close({userName: this.passedData.userName, branchCode: this.selected});
 
    }
  }



}
