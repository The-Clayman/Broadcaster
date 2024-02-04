import { Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';


@Injectable({
  providedIn: 'root'
})
export class ToasterService {

  constructor(private toster: MatSnackBar) { }

  resolveToasterClass(type:string): string {
    let res: string = ""
    switch(type) { 
      case "regular": { 
         res = "toaster-regular";
         break; 
      } 
      case "error": { 
         res = "toaster-error"
         break; 
      } 
      default: { 
        res = "toaster-regular";
        break; 
      }
    }
    return res; 

  }


  popToasterMessage(message: string, type: string) {
    let toasterClass = this.resolveToasterClass(type);
    
    this.toster.open(message, 'Ok', {
      duration: 3000,
      panelClass: [toasterClass]
    });
  }
}
