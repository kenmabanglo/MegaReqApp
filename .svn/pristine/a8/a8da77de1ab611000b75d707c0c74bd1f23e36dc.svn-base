import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-attachments-preview',
  templateUrl: './attachments-preview.component.html',
  styleUrls: ['./attachments-preview.component.scss']
})
export class AttachmentsPreviewComponent implements OnInit {
  @ViewChild('pdfViewer') public pdfViewer;
  type: string;
  imageBlobUrl: string; imageBlobUrl2: string;
  src: Uint8Array;
  
  constructor( @Inject(MAT_DIALOG_DATA) public passedData: any,
  public dialogRef: MatDialogRef<AttachmentsPreviewComponent>,) { }
  tempBlob = null;

  ngOnInit(): void {
    if (this.passedData) {
      const p = this.passedData;
      if (p.type.search(/image/i) >= 0) {
          this.imageBlobUrl2 = p.blob;
          // this.createImageFromBlob(p.blob);
          this.type = 'image';
      }
      else if (p.type == 'application/pdf') {
        
        this.type = 'pdf';
          // this.src = p.blob;
          this.tempBlob = new Blob([p.blob], { type: 'application/pdf' });
          const fileReader = new FileReader();
          fileReader.onload = () => {
              this.src = new Uint8Array(fileReader.result as ArrayBuffer);
          };
          fileReader.readAsArrayBuffer(this.tempBlob);
      }
    }
    
  }

  _base64ToArrayBuffer(base64) {
	  var binary_string = base64.replace(/\\n/g, '');
    binary_string =  window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array( len );
    for (var i = 0; i < len; i++)        {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
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
