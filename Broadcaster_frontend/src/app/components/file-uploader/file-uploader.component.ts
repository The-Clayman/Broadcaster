import { Component } from '@angular/core';

import { BraodcasterService } from '../../services/braodcaster.service';

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrl: './file-uploader.component.css'
})
export class FileUploaderComponent {
  fileName: string = "";
  private fileData:any = null;

  constructor(private broadcasterService: BraodcasterService ){}

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

      upload$.subscribe();
    }  

  }

}
