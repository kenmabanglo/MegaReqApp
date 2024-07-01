import { AfterViewInit, Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { NotificationService } from '../../service';
import { data } from 'jquery';

@Component({
  selector: 'app-serialno',
  templateUrl: './serialno.component.html',
  styleUrls: ['./serialno.component.scss']
})
export class SerialnoComponent implements OnInit, AfterViewInit { 
  qty = 0; rows = Array(0);
  dataSource: MatTableDataSource<any> = null;

  form: FormGroup ;

  constructor(
    private fb: FormBuilder,
    private notif: NotificationService,
    public dialogRef: MatDialogRef<SerialnoComponent>,
    @Inject(MAT_DIALOG_DATA) public passedData: any,
  ) {

    this.form = this.fb.group({
      serials: this.fb.array([])
    });

   }

   get serials(): FormArray {
    return this.form.get('serials') as FormArray
   }

  ngOnInit(): void {
    if (this.passedData != null) {
      this.qty = this.passedData.qty;
      const sn = this.passedData.serials.split('; ');
      this.rows = Array(this.qty);

      for (let index = 0; index < 1; index++) {
       this.serials.push(this.addControls(index));
      }
      // console.log(this.serials.controls);
      if (sn.length > 0) {
        sn.forEach((val,i)=> {
          // console.log(i);
          this.serials.controls[i].patchValue({
            serialNo: val
          });
        });
      }
       
      // console.log(this.serials.controls);
    }
  }

  addControls(i): FormGroup {
    return this.fb.group({
      row: i,
      serialNo: new FormControl('',[Validators.required, Validators.maxLength(50)])
    });
  }
  ngAfterViewInit() {

  }

  focusNext(i) {
    let nextElementSiblingId = 'sn-input'+ (parseInt(i)+1).toString();
     
    if (i<this.serials.controls.length) {
      var next = document.querySelector('#'+nextElementSiblingId) as HTMLElement | null;
      
      if (next != null) {
        next.focus();
      } 
    }          
  }

  submitSelected() {
    const datas = this.serials.getRawValue(); 
    

    if (this.form.invalid) {
      // this.notif.error('You have to fill all serial no\'s equal to item qty.');
      this.notif.error('Serial no is required');
      
    }
    else {
      this.dialogRef.close({data: datas, index: this.passedData.index});
    }
  }

}
