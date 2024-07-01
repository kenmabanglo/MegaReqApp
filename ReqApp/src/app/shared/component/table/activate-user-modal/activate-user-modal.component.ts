import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationService } from 'src/app/shared/service';

@Component({
  selector: 'app-activate-user-modal',
  templateUrl: './activate-user-modal.component.html',
  styleUrls: ['./activate-user-modal.component.scss']
})
export class ActivateUserModalComponent implements OnInit {
  tbForm: FormGroup;
  isSaving: boolean = false;  

  constructor( private formBuilder: FormBuilder,
    private notif: NotificationService,
    private dialogRef: MatDialogRef<ActivateUserModalComponent>,
    @Inject(MAT_DIALOG_DATA) public passedData: any) { }

  ngOnInit(): void {

    this.tbForm = this.formBuilder.group({
      storeBased: [this.passedData.storeBased == 'Y'? true:false, Validators.required],
      positionRank: ['', Validators.required]
    });
  }

  onSubmit() {   
    this.isSaving = true;
    if (this.tbForm.valid) {
      let c = this.tbForm.getRawValue();
      this.dialogRef.close({
          userName: this.passedData.userName, 
          positionRank: c['positionRank'] == 'no-rank'?null:c['positionRank'], 
          storeBased: c['storeBased']?'Y':'N'
        }
      );  
        this.isSaving = false;
    }
    else {
      if (this.tbForm.get('positionRank').invalid) {
        this.notif.error("Position Rank is required!");
      }
      else {
        this.notif.error("Please fill all required fields!");
      }
      this.isSaving = false;
      return;
    }
  
  }

}
