import { HttpClient, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AuthenticationService } from 'src/app/core/service';
import { ChangePasswordModalComponent } from 'src/app/shared/component/table/change-password-modal/change-password-modal.component';
import { User } from 'src/app/shared/interface/user.interface';
import { NotificationService, UserService } from 'src/app/shared/service';
import { environment } from 'src/environments/environment';

 
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  isCreate: boolean;
  user: any; userS: any; 
  initials:string= ""; img: string=""; fname: string="";
  uploading = false; progress = 0;
  imgSrc:any;
  branch: any;

  userForm = new FormGroup({
    id:new FormControl(null),
    userName: new FormControl(''),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    positionName: new FormControl('')
  });
  userName: string;

  constructor(
    private http: HttpClient, 
    private _userData: UserService,
    private fb: FormBuilder,
    private notif: NotificationService,
    private dialog: MatDialog
    ) {
    
    }

  ngOnInit(){
    this.isCreate = true;
    this.getUser(); 
  }
 
  getUser() {
    const id = this._userData.getLoggedUserInfo()['nameid'];
    this._userData.getUserById(id)
    .subscribe(d=> {
      const u = d['userSettings'];
      // this.userS = 
      this.branch = u['branchName'];
      if (d.firstName || d.lastName)
        this.fname = d.firstName + ' ' + d.lastName;
      else 
        this.fname = d.userName;
          
      // this.img = u['image'];  
      this.userName = d.userName;

      this.userForm.patchValue({
        id:d.id,
        userName: d.userName,
        firstName: d.firstName,
        lastName: d.lastName,
        positionName: u.positionName
      });
    });
  }
   

  uploadFinished = (files) => {
    const formData = new FormData();
    this.uploading = true;
    // file upload
    if (files.length > 0) {
      let file = <File>files[0]; 
      formData.append('file', file, file.name); 

      if (!file.type.startsWith('image/')) {
        this.notif.error("Upload image only.");
        return;
      }
    }
    // other fields
    let form = this.userForm.value;
    Object.keys(form).forEach((key) => {  formData.append(key, form[key]); });
    
    this._userData.updateProfile(formData)
    .subscribe({
        next: (event) => {
          this.uploading = true;
          console.log(event);
        if (event.type === HttpEventType.UploadProgress)
          this.progress = Math.round(100 * event.loaded / event.total);
        else if (event.type === HttpEventType.Response) {
          this.notif.success("Profile saved successfully!") 
        }
      },
      error: (err: HttpErrorResponse) => console.log(err)
    }
    );

  }
 
  changePassword(userName) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";  
    const data = {
      userName: userName,
      email: userName.trim() + '@1stmegasaver.com.ph'
    };

    dialogConfig.panelClass = ['modal-table-pane'];

    dialogConfig.data = data;
    const dialogRef = this.dialog.open(ChangePasswordModalComponent,dialogConfig);
    dialogRef.afterClosed().subscribe( data => {
      if (data) {  
        this._userData.changePassword(data)
          .subscribe({
            next: (data) => { 
              this.nextResponse(data);
            }, 
            error: (response) => { 
              this.errorResponse(response);
            }
          })
      }
    });
  }

  nextResponse(data) {
    if (data.responseCode == 1) {
      const responseMsg = data.responseMessage;
        this.notif.success(responseMsg); 
    }
    else {
      const errorMsg = data.dataSet !== null? data.dataSet.join("; "): data.responseMessage;
      this.notif.error(errorMsg);
    }
  }
  errorResponse(response) {
    const errorMsg = response.name + '\n' + response.message;
    this.notif.error(errorMsg);
  }
}
