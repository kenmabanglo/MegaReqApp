import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogPopupComponent } from '../component/dialogs/confirm-dialog-popup.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogPopupService {

  constructor(private dialog: MatDialog) { }

  openConfirmDialog(msg: string){
    return this.dialog.open(ConfirmDialogPopupComponent,{
       width: '390px',
       panelClass: 'confirm-dialog-container',
       disableClose: true,
       autoFocus: true,
       position: { top: "10px" },
       data :{
         message : msg
       }
     });
  }
}
