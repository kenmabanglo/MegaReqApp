import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { inArray } from 'jquery';
import { RequestService } from '../../service';
import { AttachmentsPreviewComponent } from '../attachments-preview/attachments-preview.component';
import { RsFormComponent } from '../forms-viewer-modal/rs-form/rs-form.component';
import { Lightbox } from 'ngx-lightbox'; 
import { map } from 'rxjs';

@Component({
  selector: 'app-attachments-viewer',
  templateUrl: './attachments-viewer.component.html',
  styleUrls: ['./attachments-viewer.component.scss']
})
export class AttachmentsViewerComponent implements OnInit, AfterViewInit {
  processing=true;
  datas: any=[];
  downloading=false;
  imageBlobUrl: string | null = null;

  constructor(
    private _requestData: RequestService,
    @Inject(MAT_DIALOG_DATA) public passedData: any,
    public dialogRef: MatDialogRef<AttachmentsViewerComponent>,
    private dialog: MatDialog,
    private httpClient: HttpClient,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void {
    const d = this.passedData;
      this.processing = true;
       
      this._requestData.getRequestFiles(d.requestNo, d.branchCode, d.requestTypeCode)
      .subscribe((res: any) => {  
          var total_lineheight = 0; 
          for (let index = 0; index < res.length; index++) {
            res[index].downloading = false;
          } 
          this.datas = res; 

          this.processing = false;
      });
  }

  preview(file, index) {
    if (file.mimeType.search(/image/i) >= 0) {
      this.preview_image(file, index);
    }
    else {  
      this.preview_pdf(file, index);
    }
  }

  preview_pdf(file, index): void {
    this.datas[index].downloading = true;

    this._requestData.downloadFile(file.requestNo, file.branchCode, file.requestTypeCode, file.row)
    .subscribe(response=>{
      
     let blob:Blob = response.body as Blob;
     let fileType = response.headers.get('content-type');
     let fileName = response.headers.get('content-disposition')
     ?.split(';')[1].split('=')[1];

     const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.width = '100%'; 

      dialogConfig.data = {
        blob: blob,
        name: fileName,
        type: fileType
      };
      
      dialogConfig.panelClass = ['modal-table-pane'];
      
      const dialogRef = this.dialog.open(
        AttachmentsPreviewComponent, dialogConfig
      );

      dialogRef.afterClosed().subscribe(() => {  
        this.datas[index].downloading = false;
      });
      
    });
  
  }

  preview_image(file, index) {
    this.datas[index].downloading = true;

    this._requestData.getAttachments(file)
     .subscribe(res => { 
        
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = '100%'; 
       
        dialogConfig.data = {
          blob:  window.atob(res['file']),
          name:  res['fileName'],
          type: res['mimeType']
        };  
        dialogConfig.panelClass = ['modal-table-pane'];
        
        const dialogRef = this.dialog.open(
          AttachmentsPreviewComponent, dialogConfig
        );
  
        dialogRef.afterClosed().subscribe(() => {  
          this.datas[index].downloading = false;
        });
    });
  }

  download(file, index) {
    if (file.mimeType.search(/image/i) >= 0) {
      this.download_image(file, index);
    }
    else {  
      this.download_pdf(file, index);
    }
  }
 
  public download_pdf(file, index): void {
    this.datas[index].downloading = true;

   this._requestData.downloadFile(file.requestNo, file.branchCode, file.requestTypeCode, file.row)
   .subscribe(response=>{
    
    let fileName = response.headers.get('content-disposition')
    ?.split(';')[1].split('=')[1];
    let blob:Blob = response.body as Blob;
    console.log(blob);
    let a = document.createElement('a');
    document.body.appendChild(a);
    a.style.display = 'none';
    a.download = fileName;
    let url = window.URL.createObjectURL(blob);
    a.href = url;
    a.click();
 
    window.URL.revokeObjectURL(url); 
    this.datas[index].downloading = false;
   });

  
  }

  public download_image(file, index): void {
    this.datas[index].downloading = true;

    this._requestData.getAttachments(file)
    .subscribe(response => {  
      let fileName =   response['fileName'];
      let blob = window.atob(response['file']);  
      let a = document.createElement('a');
      a.download = fileName;
      a.href = blob;
      a.click();
    });

    this.datas[index].downloading = false;
  }

  formatBytes = function(bytes: number) {
    var units = ['B', 'KB', 'MB', 'GB', 'TB'], i;
 
    for (i = 0; bytes >= 1024 && i < 4; i++) {
        bytes /= 1024;
    }
 
    return bytes.toFixed(2) + units[i];
}

createImageFromBlob(image: Blob) {
  let reader = new FileReader();

  reader.onload = () => {
    this.imageBlobUrl = reader.result as string;
  }

  if (image) {
    reader.readAsDataURL(image);
  }
}

} 

