import { Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectionList } from '@angular/material/list';
import { NgxImageCompressService } from 'ngx-image-compress';
import { AuthenticationService } from 'src/app/core/service';
import { NotificationService, RequestService } from '../../service';

@Component({
  selector: 'app-upload-files',
  templateUrl: './upload-files.component.html',
  styleUrls: ['./upload-files.component.scss']
})
export class UploadFilesComponent implements OnInit {
  public progress: number;
  public message: string; 
  filePath: string; user: any;
  filePaths: string[]=[];
  formDatas = [];
  defaultImg: string='';imagePath: any; fname: any;
  selectedFiles: File[] = [];
  _uploading: boolean = false;
  uploadProgress=0;
  selectedOptions: string[]; 
  // validFileTypes = ['doc', 'docx', 'docs','pdf','jpeg','jpg','png'];
  validFileTypes = ['pdf','jpeg','jpg','png'];

  @Input() set initials(val: string) {
    this.defaultImg = val;  
  };

  @Input() set fullName(val: string) {
    this.fname = val;  
  };

  @Input() set uploading(val: boolean) {
    if (val !== null)
      this._uploading = val;
  }

  @Input() set _selectedFiles(files: File[]) {
    console.log(files);
    this.selectedFiles = files;
  }

  @Input() set _uploadProgress(per) {
   
    if (per != null) {
      this.uploadProgress = per;
    }
  } 
  @Output() public imageData = new EventEmitter();

  constructor(private imageCompress: NgxImageCompressService,
    private notif: NotificationService,
    public dialogRef: MatDialogRef<UploadFilesComponent>,
    @Inject(MAT_DIALOG_DATA) public passedData: any,
    private requestService: RequestService
    ) { 
     }

    file: any;
    localUrl: any;
    localCompressedURl:any;
    sizeOfOriginalImage:number;
    sizeOFCompressedImage:number;

  ngOnInit(): void {
   if (this.passedData && this.passedData.attached.length > 0) {
    this.selectedFiles = this.passedData.attached;
   }
  }
 
  imagePreview(files: FileList,$event) {
    if (files.length === 0) {
      return;
    }
    for (let i = 0; i < files.length; i++) {
      let file = <File>files[i]; 
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop();
      
      // console.log(fileExtension);

      if (this.validFileTypes.indexOf(fileExtension) > -1) {
        if (fileExtension == 'pdf')
        {
          this.selectedFiles.push(file);
        }
        else {
          // image

          const reader = new FileReader();
          reader.onload = () => {
            let filePath = reader.result as string;
            this.compressFile(filePath,fileName);
          }
          reader.readAsDataURL(file);
 
        } 
      
      } else {
        this.notif.error("Unacceptable File Type: " + fileExtension);
      }
 
    }
  }

  imgResultBeforeCompress:string;
  imgResultAfterCompress:string;
  compressFile(image,fileName) {
    var orientation = -1;
    this.sizeOfOriginalImage = this.imageCompress.byteCount(image)/(1024*1024);
      //console.warn('Size in bytes is now:',  this.sizeOfOriginalImage);
      this.imageCompress.compressFile(image, orientation, 50, 50).then(
      result => {
      this.imgResultAfterCompress = result;
      this.localCompressedURl = result;
      this.sizeOFCompressedImage = this.imageCompress.byteCount(result)/(1024*1024)
      //console.warn('Size in bytes after compression:',  this.sizeOFCompressedImage);
      // create file from byte
      const imageName = fileName;
      // call method that creates a blob from dataUri
      //const imageBlob = this.dataURItoBlob(this.imgResultAfterCompress.split(',')[1]);
      //imageFile created below is the new compressed file which can be send to API in form data
      const imageFile = new File([result], imageName, { type: 'image/jpeg' });
 
      //  this.filePaths.push(result); 
       this.selectedFiles.push(imageFile);
      //  console.log(imageFile);
    });
  }
 
  formatBytes = function(bytes: number) {
    var units = ['B', 'KB', 'MB', 'GB', 'TB'], i;
 
    for (i = 0; bytes >= 1024 && i < 4; i++) {
        bytes /= 1024;
    }
 
    return bytes.toFixed(2) + units[i];
}

  deleteFile() {   
    if (this.selectedOptions.length > 0) {
      this.selectedFiles = this.selectedFiles.filter(e => !this.selectedOptions.includes(e.name));
      this.selectedOptions = [];
    }  
  } 

  cancel() {
    this.dialogRef.close();
  }

  uploadSubmit() { 
    
    if (this.selectedFiles.length > 0) {    
      
      this.dialogRef.close({attached_files: this.selectedFiles});
      if (this.selectedFiles.length == 0)
        this.filePaths = [];
    }
    else {
      this.notif.error("No image/s found!");
    }
    
  }

}
