import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';

import { AuthenticationService } from 'src/app/core/service';
import { User, RequestTypeMaster, SupplierMaster, DivisionMaster } from 'src/app/shared/interface';
import { RequestService, ViewMasterService, NotificationService, ConfirmDialogPopupService, SystransactionparamService } from 'src/app/shared/service/';
import { form_headers } from './_request_form_group';
import  requestTypes  from 'src/app/core/data/request-type-master.json';
import { DatePipe, Location } from '@angular/common';
import { SuppliersComponent } from 'src/app/shared/component/modals/suppliers/suppliers.component';
import { ApproversComponent, ItemsComponent } from 'src/app/shared/component';
import { SerialnoComponent } from 'src/app/shared/component/serialno/serialno.component';
import { dynamic_form, dynamic_items, approvers } from './_form_dynamics';
import { UploadFilesComponent } from 'src/app/shared/component/upload-files/upload-files.component';
import { AddItemsModalComponent } from 'src/app/modules/request/form/add-items-modal/add-items-modal.component';
import { ReferenceAdbComponent } from 'src/app/shared/component/modals/reference-adb/reference-adb.component';
import { AttachmentsViewerComponent } from 'src/app/shared/component/attachments-viewer/attachments-viewer.component';
// import branchesJson from 'src/app/core/data/branches.json';
import { Router } from '@angular/router';
import { ReferenceRfpComponent } from 'src/app/shared/component/modals/reference-rfp/reference-rfp.component';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customDecimalFormat'
})
export class CustomDecimalFormatPipe implements PipeTransform {
  transform(value: number | string): string {
    // Convert value to number if it's a string
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;

    // Check if value is NaN or null
    if (isNaN(numericValue) || value === null) {
      return null;
    }

    // Format the number to have two decimal places and commas as thousand separators
    return numericValue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  providers: [DatePipe]
})
export class FormComponent implements  OnInit, AfterViewInit { 
  //  
  requestNum: string;
  requestForm: FormGroup;
  selectedAdb: any;
   // form getters
   get headers() : FormGroup {
    return this.requestForm.get("headers") as FormGroup
  }
  get items() : FormArray {
    return this.requestForm.get("items") as FormArray
  } 
  // 
  
  modal = false;
  fields = dynamic_form;
  f_items = dynamic_items; 
  approvers = approvers;
  requestDate:Date = new Date();
  temp_group = {};
  required_items:number = 0;
  attached_files: File[]=[];
  supplierCodeTemp: string;
  requestTypes: RequestTypeMaster[];
  selectedItemcodes: any[]; 
  //   
  user: User;
  suppliers: SupplierMaster[];
  req = ''; supCode: string; itemsType = '';
  selectedSupplier = []; selectedItemCode = {};
  error = ""; success = "";
  isSaving = false; 

  searchDialogRef: MatDialogRef<SuppliersComponent>;
  selectedApprover: any;
  addedSerialNo: any;

  columns: any[]; item_columns = []; selected_item:any; selectedrow:number;

  edit = false;
  _albums: Array<any>;

  // branches
  isMultipleBranch = false;
  branchSelect='';
  branches: DivisionMaster[]; 
  hiddenCloseBranch: boolean = true;   

  locations = [];

  constructor(
    private notif: NotificationService,
    private fb: FormBuilder,
    private readonly ref: ChangeDetectorRef,
    private auth: AuthenticationService,
    private vw: ViewMasterService,
    private request: RequestService,
    private datePipe: DatePipe,
    private confirmDialog: ConfirmDialogPopupService,
    private trxService: SystransactionparamService,
    public dialog: MatDialog,
    private _requestData: RequestService,
    private _location: Location,
    private router:Router,
    private vwMaster: ViewMasterService
  ) {
    this.auth.user.subscribe(x => this.user = x); 
    this.req = ''; 
    this.requestTypes = requestTypes;

    this.requestForm  = this.buildForm();  

    if (this.user.userSettings.userBranches.length > 0) {
      this.isMultipleBranch = true;
      this.initBranches();
    } 
    else {
      this.headers.controls['branchCode'].setValue(this.user.branchCode);
      this.branchSelect = this.user.branchCode;
    }

    this.getAllLocations();
   }

  ngOnInit(): void { 

      // check if "edit" then pre-populate form values
      const edit = window.history.state;
      if (edit && edit.requestTypeCode != undefined) {
        this.edit = true;
        this.setFormPreValues(edit);
     }
     else {
      this.req = ''; this.resetForm(); 
      this.headers.patchValue({
        requestDate: new Date(),
        requestNo: '',
        requestTypeCode: ''
      }, {emitEvent: true});
     }

  }
  getAllLocations() {
    this.request.getLocations()
    .subscribe({
      next: (res) => {
        this.locations = res.dataSet;
      },
      error: (err) => {

      }
    })
  }
  rtypeOnChanges(reqType) {

      if (!this.edit) {
        this.getNextTallyNo(reqType); 
      }

      this.enableDisabled(reqType);

      
      if (reqType != null) {
        this.resetForm();
        this.required_items = 0;
        // //console.log(val);

        this.dynamicValidators(reqType); 

        if(['RS','RTO','RFS','RFA','ADB','RFB','FL'].includes(reqType)) {
          this.item_columns = []; this.columns = [];
          this.addItemControls(reqType); 
          this.required_items = 1;
        }
        
        if (['RTO'].includes(reqType) && this.isMultipleBranch && 
        this.user.positionName.trim().toLowerCase() == "district manager") {
          this.autoApproveRequest();
        }
        else {
          this.removeAutoApproveRequest();
        }

       
       
      }
    // });

  }

  setFormPreValues(val) {

    this._requestData.getRequestDetails(val.requestNo, val.branchCode, val.requestTypeCode)
    .subscribe((result: any) => {   
      let res = result['requestHdr'];
      let items = result['requestItems'];

      this.req = val.requestTypeCode; 
      this.branchSelect = val.branchCode;
      this.rtypeOnChanges(this.req);

      // set header 
//      console.log(this.headers.controls);
      Object.keys(this.headers.controls).forEach((key: string ) => { 
       
        if(res[key] != undefined) {
          this.headers.controls[key].setValue(res[key]); 
        }

      });

      for (let ind = 0; ind < items.length; ind++) {
        let itemCtrls = this.addItemControls(this.req,ind);
        this.items.push(itemCtrls); 
        this.items.controls[ind].patchValue(items[ind]); 
      } 

    });
    
  }
  
  autoApproveRequest() { 
      this.headers.patchValue({
        approver1: this.user.userName,
        approverName1: this.user?.userSettings.fullName, 
        approved1: 'Y',
        approvedDate1: new Date()
      }, {emitEvent: true}); 
  }
  removeAutoApproveRequest() {
    this.headers.patchValue({
      approver1: null,
      approverName1: null, 
      approved1: null,
      approvedDate1: null
    }, {emitEvent: true}); 
  }

  viewAttachments() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '100%'; 

    const val = window.history.state;
    dialogConfig.data = val;
  
    dialogConfig.panelClass = ['modal-table-pane'];
     
    this.dialog.open(
      AttachmentsViewerComponent, dialogConfig
    );

  }
  resetForm(req: string='') { 
    this.requestForm = this.buildForm();  
    this.patchDefaultValues(req); 
    return true;
  }
  patchDefaultValues(req: string='') {
    this.headers.patchValue({  
      requestDate: this.datePipe.transform(new Date(), 'mediumDate'),
      requestTypeCode: this.req,
      branchCode: this.branchSelect,
      requestNum: this.requestNum
    });
     
    this.supplierCodeTemp = ""; this.selectedItemcodes = [];
    //console.log(this.headers.getRawValue());
  }
  // fix: ExpressionChangedAfterItHasBeenCheckedError
  ngAfterViewChecked(): void {
    this.ref.detectChanges();
  } 
  
  ngAfterViewInit() {
     
  }
 
  buildForm() {
    return this.fb.group({
      headers: this.fb.group(form_headers),
      items: this.fb.array([])
    });
  }
 

  // addItems(num: number): FormGroup {
  addItems(action:string,event: Event,index:number=0) { 
    event.preventDefault();

    let supplierCode = this.headers.controls['supplierCode'].value;
     
    if (supplierCode == null &&  this.req == "RS") {
      this.notif.error('No supplier found. Please select a supplier first.');
      return; 
    }

    let referenceRfp = this.headers.controls['referenceRfp'].value;
    if (referenceRfp == null && this.req == "FL") {
      this.notif.error('Please select an approved RFP first to continue..');
      return; 
    }
   //let index;
    
    if (action == 'add') 
      index = this.items.length;
    // else index = this.selectedrow;
  
      if (index > 10 && action == 'add' && this.req !== 'ADB') {  
          this.notif.error('You have reached the maximum limit of 11 items per slip');
          return; 
      }
      else if(index > 3 && action == 'add' && this.req == 'ADB') {
        this.notif.error('You have reached the maximum limit of 3 supplier');
        return; 
      }
      else if (index > 10 && action == 'add' && this.req == 'FL') {  
        this.notif.error('You have reached the maximum limit of 10 items per expenses');
        return; 
    }

      let itemCtrls = this.addItemControls(this.req,index);

      // modal
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.width = '100%';
      dialogConfig.panelClass = ['modal-table-pane'];
      dialogConfig.data = {
        f_items: this.f_items, 
        controls: itemCtrls,
        values: action == 'edit'? this.items.at(index).getRawValue():[],
        type: this.req,
        i: index,
        action: action,
        locations: this.locations,
        supplierCode: supplierCode
      }
      const dialogRef = this.dialog.open(AddItemsModalComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(val => {
        if (val) { 
         if (action == 'add') {
          this.items.push(itemCtrls);
          this.items.at(index).setValue(val.item);

          // auto-calculate return or refund
          this.calculateReturnRefund(); 

          //reset immediate when adding items
          if(!this.isMultipleBranch) {
            if (this.req == 'ADB') {
              this.headers.patchValue({
                approver1: "",
                approverName1: ""
              });
            }

            if (this.req == 'FL') {
              this.headers.patchValue({
                approver1: "",
                approverName1: ""
              });
            }
          }
         }
         else if (action == 'edit') {
          this.items.at(index).setValue(val.item);
         }

        } 
      }); 
      
  }
 
  calculateReturnRefund() {
    const total_items_amt = this.items.getRawValue().map(x=>x.price).reduce((sum,cur)=> parseFloat(sum) + parseFloat(cur),0);
    let extendedAmt = this.headers.controls['extendedAmount'].value;
    extendedAmt = extendedAmt.replace(/,/g, '') || 0;
    let amt_return = extendedAmt - total_items_amt;
    console.log(this.items.getRawValue());
    console.log(amt_return, extendedAmt, total_items_amt);
    this.headers.patchValue({refundAmount: amt_return});
  }

  addItemControls(type=this.req,index=0): FormGroup {
    
    let g = {}; 
    let c = this.columns;
    
      if (c.length == 0) {
        c.push('row');
        
        Object.keys(dynamic_items).forEach((val,i)=> {
          const d = dynamic_items[i];
          // //console.log(d);
          
          if(d['requestTypes'].includes(type)) {  

             c.push(d['key']);   
            let k = d['key']; let l = d['label'];
            // dynamic theads
            if(d['type'] != 'hidden') {
              // RS 
              if (type == 'RS') {
                if (k == 'serialNo') l = 'SN';
                if (k == 'quantity') l = 'QTY';
              }
              if (type == 'RTO') {
                if (k == 'itemCode') l = 'Model';
                if (k == 'supplierCode') l = 'Supplier';
              }
             
              this.item_columns.push({
                key: k, 
                label: l, 
                type: d['type'],
                decimal: d['decimal']
              });
            }  

          };
        }); 

    }
    
    c.forEach((val)=> {
  
      if (['serialNo','row','status','remarks','onhand','supplierCode','locationCode'].includes(val)) {  
        g[val] = new FormControl(val == 'row'? index: ''); 
        
      }  
      else {
        if(['quantity','totalPrice'].includes(val)) {
          // if (type == 'RFS' && val == 'totalPrice') {
          //   g[val] = new FormControl(null,[Validators.pattern("^[0-9]{1,3}(,[0-9]{3})*(\.[0-9]+)*$")]);
          // }
          // else {
            g[val] = new FormControl(null,[Validators.required, Validators.pattern("^[0-9]{1,3}(,[0-9]{3})*(\.[0-9]+)*$")]);
          // }
        }
        else if(['cost','totalCost','price'].includes(val)) {
          g[val] = new FormControl(null,[Validators.pattern("^[0-9]{1,3}(,[0-9]{3})*(\.[0-9]+)*$")]); 
        }
        else {
          g[val] = new FormControl(null,[Validators.required]); 
        }       
  
        if(['price'].includes(val) && type == "FL") {
          g[val] = new FormControl(null,[Validators.required, Validators.pattern("^[0-9]{1,3}(,[0-9]{3})*(\.[0-9]+)*$")]);
        }
      }
    });
    
    return this.fb.group(g);
  }

  getNextTallyNo(reqType) {    
    if(this.isMultipleBranch && this.branchSelect  && this.branchSelect != '') {
      this.user.branchCode = this.branchSelect;
    }
    if (this.req != '' && this.branchSelect != ''){               
      this.displayNextTallyNo(reqType);  
    }
    else {
      this.headers.patchValue({requestNo:""});
    }
  }

  displayNextTallyNo(reqType) {
    // //console.log(this.headers.get('branch').value);
    //console.log(reqType);
    this.req = reqType;
    let bcode = '';
    if (this.isMultipleBranch) {
      if (this.headers.get('branchCode').value) {
        bcode = this.headers.controls['branchCode'].value; 
      } 
    }
    else {
      bcode = this.user.branchCode;
    }
    // //console.log(bcode);
    if (reqType != '' && bcode != '') {
        this.trxService.getDisplayCode(reqType, bcode)
        .subscribe(res => {
          this.requestNum = res; 
          this.headers.patchValue({requestNo:res});
        });
    }
  } 

  enableDisabled(type) { 
    
    this.fields.flatMap((t) => (t.requestTypes.includes(type) ? [t.disabled = false] : [t.disabled = true]));
    this.f_items.flatMap((t) => (t.requestTypes.includes(type) ? [t.disabled = false] : [t.disabled = true]));
    this.approvers.flatMap((t) => (t.requestTypes.includes(type) ? [t.disabled = false] : [t.disabled = true]));
    this.resetForm();

  }

  dynamicValidators(reqType: string) {
    let approvers = 1;   

      Object.keys(dynamic_form).forEach((val,i)=> {
        const d = dynamic_form[i];
        const key = this.headers.get(d['key']);
//        //console.log(key.validator);
        key.clearValidators();
        key.setErrors(null);
        ////console.log(key.validator);

        if(d['requestTypes'].includes(reqType)) { 
          //console.log(reqType, d['key'],d['requestTypes']);
          if (['ewt','extendedAmount'].includes(d['key'])) {
            key.setValidators([Validators.required, Validators.pattern("^[0-9]{1,3}(,[0-9]{3})*(\.[0-9]+)*$")]);
          } 
          else if (['refundAmount'].includes(d['key'])) {
            // accepts negative
            key.setValidators([Validators.required, Validators.pattern("^(-*[0-9]){1,3}(,[0-9]{3})*(\.[0-9]+)*$")]);
          } 
          else {
            key.setValidators([Validators.required]);
          }
          key.markAsPristine();
          key.markAsUntouched(); 
          key.updateValueAndValidity();

          ////console.log(d['key'],this.headers.get(d['key']).hasValidator(Validators.required));
         } 
      }); 


   
  } 

  addSerial(name: string, index:number) {  

    const i = this.items.controls[index]['controls'];
   
    let qty = i['quantity'].value;
    /*qty = parseFloat(qty.replace(/,/g,''));*/
    const serials = i['serialNo'].value;
    const description = i['description'].value;

    if (qty == null || qty <= 0) {
      this.notif.error("Please input a valid qty");
    }
    else if (description == null) {
      this.notif.error("No selected item found.");
    }
    else {
      this.openSearch({name,qty,index, serials},null); 
    }
  }

  openSearch(data,event: Event) {
    event.preventDefault();

      if (this.isMultipleBranch && this.branchSelect == "") {
          this.notif.error("Kindly select a branch to proceed.");
          return;
        
      }
 
    data.branchCode = this.user.branchCode;
      
      
      //////console.log(data);
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.width = '100%';
      dialogConfig.panelClass = ['modal-table-pane'];

      if (data.name == 'supplierName') {
        const dialogRef = this.dialog.open(SuppliersComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            
            this.selectedSupplier = result.data;
            // this.supplierCodeTemp = result.data.supplierCode;
            this.headers.patchValue({
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
            data.itemCode = result.data['itemCode'] + ' - ' + result.data['itemName'];
            // data.description = result.data['itemName'];
            data.cost = result.data['cost'];
            // this.selectedItemCode = data;

          this.setSelectedItemCode(data);
          }  
        });
  
      }

      if (data.name == 'description') {  
  
        const dialogRef = this.dialog.open(ItemsComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(result => {
          
            if (result) {  
              const rd = result.data; 
              data.itemCode = rd['itemCode'];
              data.description = rd['itemCode'] + ' - ' + rd['itemName'];
              data.serialized = rd['serialized'];

              this.setSelectedItemCode(data);

            }  
          }
        );
  
      }

      if (data.name == 'serialNo') {  
      
        dialogConfig.data = {
          qty: data.qty,
          serials: data.serials,
          index: data.index
        }

        const dialogRef = this.dialog.open(SerialnoComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(result => {
          
          if (result) {  
            // //////console.log(result);
            data.serialNo = result.data;
            data.index = result.index;
            this.addedSerialNo = data;
            const h = this.items.getRawValue();
            const r = data.serialNo.map(t => t.serialNo);
            const itemCode = this.items.controls[data.index]['controls']['itemCode'].value;
            //check serial if exists in description
            this.items.controls[data.index].patchValue({
              serialNo: r.join('; ')
            }); 
          }  
        });
    
      }

      if (data.name.search("approver")>=0) {
        ////console.log(this.req);
        let estimatedAmt:any;
        if (this.req == 'ADB') {
          estimatedAmt = this.items.getRawValue().map(x=>x.totalPrice).reduce((sum,cur)=> parseFloat(sum) + parseFloat(cur),0);
          //console.log(this.items.getRawValue());
          //console.log(estimatedAmt);
          
          if(estimatedAmt == 0 || estimatedAmt == null) {
            this.notif.error("Please input estimated amount to continue...");
            return;
          }
        }
        else if (['RFP','RFA','FL'].includes(this.req)) {
          estimatedAmt = this.headers.controls['extendedAmount'].value;
          //console.log(estimatedAmt);
          if (estimatedAmt == null || estimatedAmt == 0)
          {
            this.notif.error("Please input extended amount to continue...");
            return;
          } 
          else if (estimatedAmt.indexOf(',') > -1) {
            //console.log(estimatedAmt);
            estimatedAmt = estimatedAmt.replace(/,/g, '') || 0;
          } 
        }
        ////console.log(estimatedAmt);
        data.reqType = this.req;
        data.estimatedAmt = estimatedAmt;
        
        dialogConfig.data  = data;
        //////console.log(data);
        const dialogRef = this.dialog.open(ApproversComponent, dialogConfig); 
        dialogRef.afterClosed().subscribe(result => { 
          if (result) {
            data.approver = result.data.userName; 
            this.selectedApprover = data;

            const h = this.headers.getRawValue();
            const r = data.approver;
          
            // if (h.approver1 == r || h.approver2 == r || h.approver3 == r || h.approver4 == r || h.approver5 == r) {
            //   this.notif.error("Approver already exists! Please select another approver.");
            // }
            // else {
              ////console.log(data.name, data.fullname);
              this.headers.controls[data.name].setValue(data.approver);
              this.headers.controls[data.fullname].setValue(result.data.fullName);
            // }   
          }
        });
      }

      if (data.name == 'referenceAdb') {
        const dialogRef = this.dialog.open(ReferenceAdbComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.headers.patchValue({
              referenceAdb: result.data
            });
          }  
        });
      }

      if (data.name == 'referenceRfp') {
        const dialogRef = this.dialog.open(ReferenceRfpComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
           // console.log(result);
            this.headers.patchValue({
              referenceRfp: result.requestNo,
              extendedAmount: result.extendedAmount
            });
          }  
        });
      }
  }

  numberFormatStyle(event,key) {
    if(event.which >= 37 && event.which <= 40) return;
      var currentInput = event.target.value;
      if (currentInput.length >= 4) {
      ////console.log(event);
      //console.log(currentInput);
      var fixedInput = Number(parseFloat(currentInput)).toLocaleString('en', {
          minimumFractionDigits: 2
        });
      //console.log(fixedInput);
      this.headers.get(key).setValue(fixedInput);
    } 
     
 }


  numberFormat(event,key) {
    // skip for arrow keys
 // 
    
   ////console.log(event);
  //  var currentInput = event.target.value;
  //  if (currentInput.length >= 3) {
  //    var fixedInput = currentInput.replace(/\D/g, "")
  //    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  //    ////console.log(fixedInput);
  //    this.headers.get(key).setValue(fixedInput);
  //  }
   ////console.log(this.req);
   // clear immediate head
   if (!this.isMultipleBranch) {
    if (['RFP','RFA'].includes(this.req) && this.headers.controls['approver1'].value) {
      this.headers.controls['approver1'].setValue("");
      this.headers.controls['approverName1'].setValue("");
    }
   }
  
 }

  setSelectedItemCode(data) {
    //////console.log(data);
    this.items.at(data.index).patchValue(
      {key: data.index, itemCode: data.itemCode, price: data.cost, quantity: 1},
    );
    
    let sn_id = 'serial-item'+data.index.toString();
    let serial_bt = document.querySelector('#'+sn_id) as HTMLButtonElement | null;
    let qty_id = 'qty-item'+data.index.toString();
    let qty_input = document.querySelector('#'+qty_id) as HTMLInputElement | null;
    
    this.items.controls[data.index]['controls']['serialNo'].clearValidators();

    if (data.serialized == 'Y') {
      qty_input.readOnly = true;
      serial_bt.disabled = false; 
      this.items.controls[data.index]['controls']['serialNo'].setValidators([Validators.required]); 
    }
    else {
      qty_input.readOnly = false;
      serial_bt.disabled = true;  
    }

    if (data.description) { 
      this.items.at(data.index).patchValue(
        {description: data.description},
        );
    }

    this.items.controls[data.index]['controls']['serialNo'].markAsPristine();  
    this.items.controls[data.index]['controls']['serialNo'].markAsUntouched();  
    this.items.controls[data.index]['controls']['serialNo'].updateValueAndValidity();  
    
  }
 
  deleteItem() {  
    this.items.removeAt(this.items.length-1); 
    if (this.req == 'ADB') {
      this.headers.patchValue({
        approver1: "",
        approverName1: ""
     });
    }
  }

  uploadAttachments() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '100%'; 
    dialogConfig.panelClass = ['modal-table-pane'];
    dialogConfig.data = {
      attached: this.attached_files,
      reqNo: this.headers.controls['requestNo'].value,
      reqType: this.req,
      branchCode: this.user.branchCode
    }

    const dialogRef = this.dialog.open(UploadFilesComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => { 
      //////console.log(result);
      if (result.attached_files) {
       this.attached_files = result.attached_files;
      }
    });
  }

  items_grand_total = 0;
  calculateTotal(type, index) {
    const row = this.items.at(index);
  }

  refresh(event): void {
    event.preventDefault();
    window.location.reload();
  }

  initBranches() {
    const branches = this.user.userSettings.userBranches.map(x=>x.branchCode);
    this.vwMaster.divisionMaster()
    .subscribe({
      next: (res) => {
       // this.branches = res;
        this.branches = res.filter(x=>branches.includes(x.divisionCode));
    
      },
      error: (err) => {
        this.notif.error(err.message);
      }
    });

    
  }
  
  public hasError= (controlName: string, errorName: string) => {
    return this.headers.controls[controlName].hasError(errorName);
  }

  saveForms() {
    const hd = this.headers.getRawValue();  
    
    if (hd['isReferral']) {
      hd['isReferral'] = 'Y';
    }
    else {
      hd['isReferral'] = 'N';
    }
    if ( hd['rfpSource'] == 'REF') {
      hd['isReferral'] = 'Y';
    }
    // console.log(hd);
  }

 
  saveForm() { 
    this.isSaving = true;
 
   if (!this.isMultipleBranch) { 
    this.headers.controls['branchCode'].setValue(this.user.branchCode);
   }

   if (this.req != 'RFP') {
    this.headers.controls['ewt'].setValue(0);
   }

   if (!['RFP','RFA','FL'].includes(this.req)) {
    this.headers.controls['extendedAmount'].setValue(0);
   }

   if (!['FL'].includes(this.req)) {
    this.headers.controls['refundAmount'].setValue(0);
   }

   if (this.req != 'RTO') {
    this.headers.controls['requestItemsType'].setValue('');
   }

   //console.log(this.headers.controls);
   
   let header_invalid = 0; 
   Object.keys(this.headers.controls).forEach(key => { 
      const invalid = this.headers.get(key).invalid;
      if (invalid) {
        header_invalid += this.headers.get(key).invalid? 1:0; 
        //console.log('invalid', key);
     }   
    }); 
    
    const headers = this.headers.getRawValue();
    const items = this.items.getRawValue();
   // //console.log(this.headers.controls);
    if(header_invalid > 0) {
      this.notif.error('Fill all required fields!');
      this.isSaving = false;
    }
    else if (this.items.invalid) {
      this.notif.error('Fill all required items fields');

      if (this.items[this.items.length-1].get('serialNo').invalid())
      {
        this.notif.error('Serial No is required!');
      }
      this.isSaving = false;
    }
    else if (this.required_items > 0 && this.items.length == 0) {
      this.notif.error('Required items of at least 1');
      this.isSaving = false;
    }
    else { 
      let files = this.attached_files;

      if(!this.edit) {
        headers.createdBy = this.user.userName;
        headers.createdDate = new Date();
      }
      else {
        headers.updatedBy = this.user.userName;
        headers.updatedDate = new Date();
      }
      
  
      headers.requestDate = new Date();
      
      if (headers.requestNo == 'fetching ADB No...') headers.requestNo = '';

   
      if (headers['ewt'] || headers['extendedAmount'] || headers['refundAmount']) {
        if (isNaN(headers['ewt']) && headers['ewt'].indexOf(',') > -1) {
          headers['ewt'] = parseFloat(headers['ewt'].replace(/,/g, ''));
        }
        if (isNaN(headers['extendedAmount']) && headers['extendedAmount'].indexOf(',') > -1) {
          headers['extendedAmount'] = parseFloat(headers['extendedAmount'].replace(/,/g, ''));
        }
        if (isNaN(headers['refundAmount']) && headers['refundAmount'].indexOf(',') > -1) {
          headers['refundAmount'] = parseFloat(headers['refundAmount'].replace(/,/g, ''));
        }
      }; 
      
      for (let index = 0; index < items.length; index++) {
        const i = items[index];
        if(i['requestNo'] == null && i['itemCode'] == null && i['description']==null && i['quantity']== null) {
          delete items[index];
          delete items['row'];
        }
        else {
          items[index]['row'] = index;
        }
      }
        delete(headers['supplierName']);

        headers.requestTypeCode = this.req;

        headers['isReferral'] = headers['isReferral']? 'Y':'N';

        if ( headers['rfpSource'] == 'REF') {
          headers['isReferral'] = 'Y';
        }
        //console.log(headers['rfpSource']);
        const datas = { 
          b_requestMaster: headers,
          b_requestItems: items
         }
         
         console.log(datas); 

        // this.isSaving = false;

      let req;
      if (!this.edit) {
        req = this.request.saveRequest(datas);
      }
      else {
        //const datas = headers;
        req = this.request.updateRequest(datas);
      } 

      req.subscribe({
        next: (data) => {
          if (data.responseCode == 1) {

            //upload files if exists
            if (files.length > 0) {
              const formData = new FormData();
              files.forEach((f)=>formData.append('files',f));
              formData.append("requestNo",headers.requestNo);
              formData.append("requestTypeCode",headers.requestTypeCode); 
              formData.append("branchCode",headers.branchCode);  

              this.request.uploadFiles(formData)
              .subscribe(
                {
                  next: (res) => {
                    this.success = data.responseMessage;
                    this.isSaving = false;
                    let req = this.req;
                    this.req = ''; 
                    this.headers.controls['requestNo'].setValue(''); 
                    
                  },
                  error: (err) => {
                    // this.error = data.responseMessage;
                    this.isSaving = false;
                      console.warn(data.responseMessage);
                  }
                }
              );
            }
                      
            this.notif.success( data.responseMessage);
        
            // this.resetForm();
            if (this.edit) {
              setTimeout(()=>  this._location.back(),500);
            }
            else {
              setTimeout(()=>  this.router.navigate(['request/request-history']),500);
              
            }

            this.isSaving = false;

          }
          else {
            let err = data.responseMessage != "" ? data.responseMessage : (data.dataSet.join("; "));
            this.notif.error(err);
            this.isSaving = false;
          }
        },
        error: (error) => {
          let err  = error.error.title || '';  
          this.notif.error(err);
          this.isSaving = false;
        },
      }); 
 
    }
    
  }
   
}
