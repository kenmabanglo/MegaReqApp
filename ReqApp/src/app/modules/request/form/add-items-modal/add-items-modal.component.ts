 import { CurrencyPipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationService } from '../../../../shared/service/notification.service';
import { ItemsComponent } from '../../../../shared/component/modals/items/items.component';
import { SuppliersComponent } from '../../../../shared/component/modals/suppliers/suppliers.component';
import { merge } from 'rxjs';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { RequestService } from 'src/app/shared/service';

@Component({
  selector: 'app-add-items-modal',
  templateUrl: './add-items-modal.component.html',
  styleUrls: ['./add-items-modal.component.scss']
})
export class AddItemsModalComponent implements OnInit {
  items: FormGroup;
  f_items:any[];
  i: number;
  edit = false;
  edittableFields:string[] = ['quantity','onhand','remarks'];
  serialized = false;
  locations = []; location='';
  saving = false;
  supplierCode = "";

  constructor(
    private fb: FormBuilder,
    private request: RequestService,
    private notif: NotificationService,
    private dialogRef: MatDialogRef<AddItemsModalComponent>,
    private dialog: MatDialog,  
    @Inject(MAT_DIALOG_DATA) public passedData: any,
  ) { 
    if(this.passedData != null) {
      this.f_items = this.passedData.f_items.filter(x=>!x['disabled']); 
      this.i = this.passedData.i; 
      this.items = this.passedData.controls;  
      this.locations = this.passedData.locations;
      this.supplierCode = this.passedData.supplierCode;
  
      if (this.passedData.action == 'edit') {
        this.edit = true;
        this.items.setValue(this.passedData.values);
      }
    }  
  }

  ngOnInit(): void {
  
  }

  calculateTotal() {
    let cost = 0;
    // .replace(/,/g, '')
    // if (this.passedData.type =='RTO') cost = parseFloat(this.items.get('price').value.replace(/,/g, '')) || 0;
    if (this.passedData.type =='RFS') cost = parseFloat(this.items.get('cost').value.replace(/,/g, '')) || 0;

    let qty = this.items.get('quantity').value;
    qty = parseFloat(qty.replace(/,/g,''));
    
    if ((qty+"").indexOf(',') > -1) {
      qty = parseFloat(qty.replace(/,/g,''));
    }
    let total = cost * parseFloat(qty);
    this.items.get('totalPrice').setValue(total);
  }

  openSearch(data, event) {
 
    event.preventDefault(); 
    this.serialized = false;

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '100%';
    dialogConfig.panelClass = ['modal-table-pane'];
  
    if (data.name == 'supplierName') {
      const dialogRef = this.dialog.open(SuppliersComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
           
          this.items.patchValue({
            supplierCode: result.data.supplierCode,
            supplierName: result.data.company
          });
        }  
      });
    }
    
  if (data.name == 'itemCode') {  
   
    const dialogRef = this.dialog.open(ItemsComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      
      if (result) {  
        data = result.data;
        data.itemCode = result.data['itemCode']; 
        data.cost = result.data['cost']; 

        if (data['serialized'] == "Y") {
          this.serialized = true;
        } 

       this.setSelectedItemCode(data);
      }  
    });

  }

  if (data.name == 'description') {  
    if (this.passedData.type == "RS") {
      dialogConfig.data = {
        supplierCode: this.supplierCode
      }
    }
    
    const dialogRef = this.dialog.open(ItemsComponent, dialogConfig);
    dialogRef.afterClosed().subscribe( result => {
         
        if (result) {  
          const rd = result.data; 
          //console.log(rd);
          // data.description = rd['itemName'] + '('+rd['itemCode'] + ') ';
          data.itemCode = rd['itemCode'];
          data.description = rd['itemCode'] + ' - ' + rd['itemName'];
          data.serialized = rd['serialized']; 
          data.cost = rd['cost']; 

          if (rd['serialized'] == "Y") {
            this.serialized = true;
          }  
          this.setSelectedItemCode(data);
        }  
      }
    );

  } 
 
  }

  numberFormat(event,key) {
    // skip for arrow keys
  // if(event.which >= 37 && event.which <= 40) return;

    //console.log(event);
    var currentInput = event.target.value;
    if (currentInput.length >= 3) {
      var fixedInput = currentInput.replace(/\D/g, "")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      //console.log(fixedInput);
      // this.items.get(key).setValue(fixedInput);
    }
    else {

    }
  }

  setSelectedItemCode(data) {
    //console.log(data);
    this.items.patchValue(
      {key: data.index, 
        itemCode: data.itemCode, 
        price: data.cost, 
        cost: data.cost, 
        quantity: 1
      },
    ); 

    if (data.description) { 
      this.items.patchValue(
        {description: data.description},
        );
    }  
    if (this.passedData.type =='RS') {
      this.items.get('serialNo').clearValidators();
      this.items.get('locationCode').clearValidators();

      if (data.serialized == 'Y') { 
        this.items.get('serialNo').setValidators([Validators.required]); 
        this.items.get('locationCode').setValidators([Validators.required]); 
      } 
    
      this.items.get('serialNo').markAsPristine();  
      this.items.get('serialNo').markAsUntouched();  
      this.items.get('serialNo').updateValueAndValidity();  

      this.items.get('locationCode').markAsPristine();  
      this.items.get('locationCode').markAsUntouched();  
      this.items.get('locationCode').updateValueAndValidity(); 
    }
    
    
  }

  submitItem() {
    this.saving = true;
    if (this.items.invalid) {
      Object.keys(this.items.controls).forEach(field => {
        const control = this.items.get(field);          
        control.markAsTouched({ onlySelf: true });    
      });
      this.notif.error('Fill all required fields.');
      this.saving = false;
    }
    //verifyserial
    else if (this.passedData.type =='RS' && this.serialized) {
      const datas = {
        itemCode: this.items.get('itemCode').value,
        serialNo: this.items.get('serialNo').value,
        locationCode: this.items.get('locationCode').value,
        supplierCode: this.supplierCode
      };
      //console.log(datas);
      this.request.verifySerialNoAvailability(datas)
      .subscribe({
        next: (res) => {
         if(res.responseCode==2) {
          this.notif.error(res.responseMessage);
          this.saving = false;
         }
         else {
          this.closeModal();
         }
        },
        error: (err) => {
            var error = error.responseMessage + (error.dataSet != null? error.dataSet.join("; ") : '');
            this.notif.error(error);
            this.saving = false;
        }
      });
    }
    else {
      this.closeModal();
    }
  }

  closeModal() {
    let items = this.items.getRawValue(); 
      Object.keys(items).forEach((key, index)=> {
        if (key == 'row') return; 
        if ((['cost','price','totalCost','totalAmount'].includes(key) && this.passedData.type != 'FL')
        || (key == 'totalPrice' && this.passedData.type != 'ADB')
        || (key == 'onhand' && items[key] == '')) {
          items[key] = 0;
        } 

        if (['totalPrice'].includes(key) && this.passedData.type == 'ADB' ||
         ['price'].includes(key) && this.passedData.type == 'FL' 
          && (items[key]+"").indexOf(',') > -1) {
          items[key] = items[key].replace(/,/g, '') || 0;
        }
       }); 
      this.dialogRef.close({item: items});
  }

  public hasError= (controlName: string, errorName: string) => {
    return this.items.controls[controlName].hasError(errorName);
 }

}
