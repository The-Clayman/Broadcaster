import { Component } from '@angular/core';

import { BraodcasterService } from '../../services/braodcaster.service';
import { ToasterService } from '../../services/toaster.service';

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrl: './file-uploader.component.css'
})
export class FileUploaderComponent {
  fileName: string = "";
  private fileData:any = null;

  constructor(private broadcasterService: BraodcasterService , private toasterService:ToasterService){}

  onFileSelected(event: any) { 

    const file:File = event.target.files[0];

    if (file) {

        this.fileName = file.name;

        const formData = new FormData();

        formData.append("file", file);
        this.fileData = formData;
    }
  }

  onUploadClicked(){
    if (this.fileData != null){
      const upload$ = this.broadcasterService.uploadFile(this.fileData);

      upload$.subscribe(
        res => {console.log('HTTP response', res); this.toasterService.popToasterMessage("video "+ this.fileName+ " uploaded", "regular")},
        err => {console.log('HTTP Error', err); this.toasterService.popToasterMessage('Failed to upload video ['+ err.status+"],\n" + err.error.message, "error");},
        () => {console.log('HTTP response'); this.toasterService.popToasterMessage("video "+ this.fileName+ " uploaded", "regular")}
      );

    } else {
      this.toasterService.popToasterMessage("No file were selected to upload", "error");
    } 

  }

}
