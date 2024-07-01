import { AfterViewInit, Component, ComponentFactory, ComponentFactoryResolver, ComponentRef, Inject, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { PrintService } from '../../service/print.service';
import { AttachmentsViewerComponent } from '../attachments-viewer/attachments-viewer.component';
import { RsFormComponent } from '../forms-viewer-modal/rs-form/rs-form.component';
import { SerialnoComponent } from '../serialno/serialno.component';

@Component({
  selector: 'app-modal-wrapper',
  templateUrl: './modal-wrapper.component.html',
  styleUrls: ['./modal-wrapper.component.scss']
})
export class ModalWrapperComponent implements AfterViewInit {
  @ViewChild('container', { read: ViewContainerRef, static: true }) container: ViewContainerRef;

  @Input() componentName: string; 
  @Input() requestType: string; 
  @Input() status: string; 
  @Input() printable = false; 
  @Input() attachments: [] = [];
 
  private componentsMapping = { 
    RsFormComponent: RsFormComponent,
    SerialnoComponent: SerialnoComponent
  };
  title: any;
  recommendation: any;
  receiveData: string;
  
  constructor(
    private _print: PrintService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public passedData: any,
    public dialogRef: MatDialogRef<ModalWrapperComponent>
  ) {
  }

  ngAfterViewInit(): void { 
    this.container.clear(); 
    setTimeout(() => {
      const component =this.componentsMapping[this.componentName]; 
      if (component == SerialnoComponent) {
        const instance  = <SerialnoComponent>this.container.createComponent(component).instance;
        // instance.passedData = this.passedData;
        // instance.output.subscribe((results)=> {
        //   this.status = results.status;
        //   this.printable = results.printable;
        // })
      }
      else {
        this.container.createComponent(component)
      }
    },0);  
  }

  approve() { 
    this.dialogRef.close({data: this.recommendation,ok: true});
  }

  reject() {
    this.dialogRef.close({data: this.recommendation,ok: false});
  }

  print() {
    this._print.print();
    
  }

  viewAttachments() {
    
  }
  
}
