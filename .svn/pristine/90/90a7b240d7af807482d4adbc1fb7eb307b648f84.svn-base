//import { Component, OnInit, Inject } from '@angular/core';
//import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

//@Component({
//  selector: 'app-confirm-dialog-popup',
//  templateUrl: './confirm-dialog-popup.component.html',
//  styleUrls: []
//})
//export class ConfirmDialogPopupComponent implements OnInit {

//  constructor(
//    @Inject(MAT_DIALOG_DATA) public data,
//    public dialogRef: MatDialogRef<ConfirmDialogPopupComponent>
//    ) { }

//  ngOnInit() {
//  }

//  closeDialog() {
//    this.dialogRef.close(false);
//  }

//}

// Ken - 6/22/2024

import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog-popup',
  templateUrl: './confirm-dialog-popup.component.html',
  styleUrls: []
})
export class ConfirmDialogPopupComponent implements OnInit {
  header: string;
  message: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ConfirmDialogPopupComponent>
  ) {
    this.header = data.header;
    this.message = data.message;
  }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close(false);
  }

}
