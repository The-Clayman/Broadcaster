import { Component } from '@angular/core';

import { BraodcasterService } from '../../services/braodcaster.service';
import { ToasterService } from '../../services/toaster.service';

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrl: './file-uploader.component.css'
})
export class FileUploaderComponent {

  private fileName:string  = '';

  constructor(private broadcasterService: BraodcasterService , private toasterService:ToasterService){}

  onFileSelected(event: any) { 

    const file:File = event.target.files[0];


    if (file) {

        this.fileName = file.name;

        const formData = new FormData();

        formData.append("file", file);

        const upload$ = this.broadcasterService.uploadFile(formData);

        upload$.subscribe(
          res => {console.log('HTTP response', res); this.toasterService.popToasterMessage("video "+ this.fileName+ " uploaded", "regular")},
          err => {console.log('HTTP Error', err); this.toasterService.popToasterMessage('Failed to upload video ['+ err.status+"],\n" + err.error.message, "error");},
          () => {console.log('HTTP response'); this.toasterService.popToasterMessage("video "+ this.fileName+ " uploaded", "regular")}
      );
    }
  }

}
