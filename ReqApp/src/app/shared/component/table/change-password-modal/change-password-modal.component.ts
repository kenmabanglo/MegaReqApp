import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MustMatch } from 'src/app/core/helpers/must-match.validator';
import { NotificationService } from 'src/app/shared/service';

@Component({
  selector: 'app-change-password-modal',
  templateUrl: './change-password-modal.component.html',
  styleUrls: ['./change-password-modal.component.scss']
})
export class ChangePasswordModalComponent implements OnInit {
  changeForm: FormGroup;
 
  errorMsg: string = ""; responseMsg: string = "";
  isSaving: boolean = false;  

  constructor( 
    private formBuilder: FormBuilder,
    private notif: NotificationService,
    private dialogRef: MatDialogRef<ChangePasswordModalComponent>,
    @Inject(MAT_DIALOG_DATA) public passedData: any
  ) { 
  }

  ngOnInit(): void { 
    this.changeForm = this.formBuilder.group({
      npassword: ['', [Validators.required, Validators.minLength(6)]],
      cpassword: ['', Validators.required]
  }, {
      validator: MustMatch('npassword', 'cpassword')
  });
  }

  showPass() {
    const eye = document.querySelector('.togglePassword') as HTMLInputElement | null;
    var x = document.getElementById("password") as HTMLInputElement | null;
    if (x !== null) {
      if (x.type === "password") {
        x.type = "text";
        eye.innerHTML = "visibility_off";
      } else {
        x.type = "password";
        eye.innerHTML = "visibility";
      }
    } 
  }

  showPass2() {
    const eye = document.querySelector('.togglePassword2') as HTMLInputElement | null;
    var x = document.getElementById("cpassword") as HTMLInputElement | null;
    if (x !== null) {
      if (x.type === "password") {
        x.type = "text";
        eye.innerHTML = "visibility_off";
      } else {
        x.type = "password";
        eye.innerHTML = "visibility";
      }
    } 
  }

  public hasError = (controlName: string, errorName: string) => {
    // console.log(errorName);
    return this.changeForm.controls[controlName].hasError(errorName);
  }
 
  onSubmit() {   
    let c = this.changeForm.getRawValue();
      this.dialogRef.close({
        userName: this.passedData.userName, 
        email: this.passedData.email, 
        password: c['npassword'], 
      }
      ); 
  }

}
