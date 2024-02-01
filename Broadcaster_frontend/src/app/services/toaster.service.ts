import { Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';


@Injectable({
  providedIn: 'root'
})
export class ToasterService {

  constructor(private toster: MatSnackBar) { }


  popToasterMessage(message: string){
    this.toster.open(message, 'Ok', {duration: 3000});
  }
}
